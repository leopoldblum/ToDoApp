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
        queryKey: ['todos', userid],
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
            const queryKey = ['todos', userid];

            const placeholderID = "placeholder_" + crypto.randomUUID()

            const newTodo = { id: placeholderID, title: title, desc: desc, fulfilled: fulfilled, userid: userid };

            // console.log("placeholder todo: " + JSON.stringify(newTodo))

            await queryClient.cancelQueries({ queryKey })

            const previousTodos = queryClient.getQueryData(queryKey) || []

            queryClient.setQueryData(queryKey, (old) => old ? [...old, newTodo] : [newTodo]);

            return { previousTodos, queryKey }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData([context.queryKey], context.previousTodos || [])
            console.error("error when adding todo: " + err)
            throw err;
        },

        onSettled: (data, error, variables) => queryClient.invalidateQueries({ queryKey: ['todos', variables.userid] }),
    })
}


export const useMutationEditTodo = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, title, desc, fulfilled, userid }) => editTodo(id, title, desc, fulfilled, userid),

        onMutate: async ({ id, title, desc, fulfilled, userid }) => {
            // optimistically updating todo
            const queryKey = ['todos', userid];

            const todoBody = { id: id, title: title, desc: desc, fulfilled: fulfilled, userid: userid };

            await queryClient.cancelQueries({ queryKey })

            const previousTodos = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, (old) => old.map((todo) => todo.id === id ? todoBody : todo))

            return { previousTodos, queryKey }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData([context.queryKey], context.previousTodos)
            console.error("error when editing todo: " + err)
            throw err;

        },

        onSettled: (data, error, variables) => queryClient.invalidateQueries({ queryKey: ['todos', variables.userid] }),
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
        mutationFn: ({ todoID }) => deleteTodo(todoID),

        onMutate: async ({ todoID, userid }) => {
            const queryKey = ['todos', userid];

            await queryClient.cancelQueries({ queryKey });

            const previousTodos = queryClient.getQueryData(queryKey) || [];

            queryClient.setQueryData(queryKey, (old) =>
                old ? old.filter(item => item.id !== todoID) : []
            );

            return { previousTodos, queryKey };
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData([context.queryKey], context.previousTodos)
            console.log("error occured: " + err)
        },

        onSettled: (error, data, variables) => queryClient.invalidateQueries({ queryKey: ['todos', variables.userid] }),
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
        mutationFn: ({ userid }) => deleteAllFulfilledTodos(userid),

        onMutate: async ({ userid }) => {
            const queryKey = ['todos', userid];

            await queryClient.cancelQueries({ queryKey })

            const previousTodos = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, previousTodos.filter(todo => todo.fulfilled === false))

            return { previousTodos, queryKey }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(context.queryKey, context.previousTodos)
            console.log("error occured: " + err)
        },

        onSettled: (error, data, variables) => queryClient.invalidateQueries({ queryKey: ['todos', variables.userid] }),
    })
}