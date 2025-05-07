import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllTodos, addTodo, editTodo, deleteTodo, deleteAllFulfilledTodos } from './endpoints';

/**
 * =============================
 * Section: Queries
 * =============================
 */


/**
 * @return fetches and returns todos from server 
 */
export const useFetchTodos = (userid) => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: () => fetchAllTodos(userid),

        // sort data by ID, else it would render twice, first unsorted, then sorted   
        select: (todosFromFetch) =>
            todosFromFetch ? [...todosFromFetch].sort((a, b) => a.id - b.id) : [],

        staleTime: 50000,
    })
};


/**
 * =============================
 * Section: CRUD mutations
 * =============================
 */


/**
 * @param {(int | null)} id when null => autoId in database || when specified => add Todo with that ID in database 
 * @param {string} title title of todo
 * @param {string} desc description of todo
 * @param {boolean} fulfilled fulfillment-status of todo 
 */

export const useMutationAddTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, title, desc, fulfilled, userid }) => addTodo(id, title, desc, fulfilled, userid),

        onMutate: async ({ id, title, desc, fulfilled, userid }) => {
            // optimistically adding todo
            const placeholderID = "placeholder_" + crypto.randomUUID()

            const newTodo = { id: placeholderID, title: title, desc: desc, fulfilled: fulfilled, userid: userid };

            console.log("placeholder todo: " + JSON.stringify(newTodo))

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos']) || []

            queryClient.setQueryData(['todos'], (old) => old ? [...old, newTodo] : [newTodo]);

            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos || [])
            console.error("error when adding todo: " + err)
            throw err;
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })
}


export const useMutationEditTodo = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, title, desc, fulfilled, userid }) => editTodo(id, title, desc, fulfilled, userid),

        onMutate: async ({ id, title, desc, fulfilled, userid }) => {
            // optimistically updating todo

            const todoBody = { id: id, title: title, desc: desc, fulfilled: fulfilled, userid: userid };

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos'])

            queryClient.setQueryData(['todos'], (old) => old.map((todo) => todo.id === id ? todoBody : todo))

            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos)
            console.error("error when editing todo: " + err)
            throw err;

        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })
}


/**
 * 
 * @description deletes a todo, specified in .mutate(todoID)
 * 
 */
export const useMutationDeleteTodo = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todoID) => deleteTodo(todoID),

        onMutate: async (todoID) => {
            // console.log("optimistic update - deleting todo id: " + todoID)

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos'])

            // console.log("Prev todos: " + JSON.stringify(previousTodos))
            queryClient.setQueryData(['todos'], (old) => old.filter(item => item.id !== todoID))
            // console.log("after todos: " + JSON.stringify(queryClient.getQueryData(['todos'])))

            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos)
            console.log("error occured: " + err)
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })
}


/**
 * =============================
 * Section: additional mutations
 * =============================
 */


/**
 * 
 * @description deletes all fulfilled todos
 * 
 */
export const useMutateDAFT = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAllFulfilledTodos,

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['todos'] })
            const previousTodos = queryClient.getQueryData(['todos'])

            queryClient.setQueryData(['todos'], previousTodos.filter(todo => todo.fulfilled === false))

            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos)
            console.log("error occured: " + err)
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })
}