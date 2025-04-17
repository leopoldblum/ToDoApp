import "./TodoDeleteAllFulfilledButton.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoDeleteAllFulfilledButton = () => {

    const queryClient = useQueryClient()

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

    const mutateDAFT = useMutation({
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

    return (
        <div className="daft-button-container">
            <button className="daft-button" onClick={mutateDAFT.mutate}> clear all </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;