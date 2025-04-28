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
export const useFetchTodos = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: fetchAllTodos,
    })
};


/**
 * =============================
 * Section: CRUD mutations
 * =============================
 */


/**
 * 
 * @description creates and adds a new Todo
 * 
 */

export const useMutationAddTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ title, desc, fulfilled }) => addTodo(title, desc, fulfilled),

        onMutate: async ({ title, desc, fulfilled }) => {
            // optimistically adding todo

            const newTodo = { id: "placeholder", title: title, desc: desc, fulfilled: fulfilled };

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


export const useMutationEditTodo = (currentTodo) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inputId, inputTitle, inputDesc, inputFulfilled }) => editTodo(inputId, inputTitle, inputDesc, inputFulfilled),

        onMutate: async ({ inputId, inputTitle, inputDesc, inputFulfilled }) => {
            // optimistically updating todo

            const todoBody = { id: inputId, title: inputTitle, desc: inputDesc, fulfilled: inputFulfilled };

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos'])

            queryClient.setQueryData(['todos'], (old) => old.map((todo) => todo.id === currentTodo.id ? todoBody : todo))

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