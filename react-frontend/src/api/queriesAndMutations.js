import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


// ----- queries -----

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


// ----- mutations -----


/**
 * 
 * @param {todo} currentTodo - the todo which fulfillment shall be updated 
 * 
 * @description toggles the fulfillment-status of a given todo
 * 
 */
export const useMutateCheckbox = (currentTodo) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todoID) => todoToggleFulfill(todoID),

        onMutate: async () => {
            // optimistically toggling checkbox of todo

            const todoBody = { id: currentTodo.id, title: currentTodo.title, desc: currentTodo.desc, fulfilled: !currentTodo.fulfilled };

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos'])

            // console.log("before: " + JSON.stringify(queryClient.getQueryData(['todos'])))

            queryClient.setQueryData(['todos'], (old) => old.map((todo) => todo.id === currentTodo.id ? todoBody : todo))

            // console.log("after: " + JSON.stringify(queryClient.getQueryData(['todos'])))

            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos)
            console.log("error occured: " + err)
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })
}


const todoToggleFulfill = async (todoID) => {
    if (todoID === null)
        throw new Error("todoID is null, cant update fulfillment!");

    const getDataResponse = await fetch(
        "http://localhost:8080/todo/" + todoID,
    );
    const myData = await getDataResponse.json();

    myData.fulfilled = !myData.fulfilled;

    try {
        const updateResponse = await fetch(
            "http://localhost:8080/updateTodo/" + todoID,
            {
                method: "POST",
                body: JSON.stringify(myData),
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