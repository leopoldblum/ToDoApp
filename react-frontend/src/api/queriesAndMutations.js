import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


/**
 * =============================
 * Section: Queries
 * =============================
 */


const fetchAllTodos = async () => {
    try {

        const response = await fetch("http://localhost:8080/todos")
        const allEntries = await response.json();

        return allEntries;
    }
    catch (error) {
        console.error("recv error:", error);
        throw error;
    }
}

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
 * @description creates and adds a new Todo, automatically unfulfilled
 * 
 */

export const useMutationAddTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inputTitle, inputDesc }) => addTodo(inputTitle, inputDesc),

        onMutate: async ({ inputTitle, inputDesc }) => {
            // optimistically adding todo

            const newTodo = { id: "placeholder", title: inputTitle, desc: inputDesc, fulfilled: false };

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

async function addTodo(inputTitle, inputDesc) {

    const todoBody = { title: inputTitle, desc: inputDesc, fulfilled: false };

    try {
        const postNewTodoResponse = await fetch(
            "http://localhost:8080/todo",
            {
                method: "POST",
                body: JSON.stringify(todoBody),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (!postNewTodoResponse.ok) {
            throw new Error(
                "Error - Response Status:" + postNewTodoResponse.status,
            );
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
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

async function editTodo(id, title, desc, fulfilled) {

    const todoBody = { title: title, desc: desc, fulfilled: fulfilled };

    try {
        const updateResponse = await fetch(
            "http://localhost:8080/updateTodo/" + id,
            {
                method: "POST",
                body: JSON.stringify(todoBody),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (!updateResponse.ok) {
            throw new Error(
                "Error - Response Status:" + updateResponse.status,
            );
        }

    } catch (error) {
        console.error(error);
    }

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

async function deleteTodo(todoID) {
    if (todoID === null)
        throw new Error("todoID is null, cant delete todo!");

    try {
        const response = await fetch(
            "http://localhost:8080/todo/" + todoID,
            {
                method: "DELETE",
            },
        );

        // console.log("deleteResponse: " + response.status);

        if (!response.ok) {
            throw new Error("Error - Response Status:" + response.status);
        }

        // todoFuncAndData.updateList();
    } catch (error) {
        console.error(error);
    }
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

async function deleteAllFulfilledTodos() {
    try {
        const response = await fetch(
            "http://localhost:8080/deleteAllFulfilledTodos",
            {
                method: "DELETE",
            },
        );


        if (!response.ok) {
            throw new Error("Error - Response Status:" + response.status);
        }
    } catch (error) {
        console.error(error);
    }
}