import "./TodoDeleteButton.css"
import TrashIcon from "@heroicons/react/16/solid/TrashIcon.js"
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoDeleteButton = ({ currentTodo }) => {

    const todoFuncAndData = useContext(todoListProvider);
    const queryClient = useQueryClient()

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

            todoFuncAndData.updateList();
        } catch (error) {
            console.error(error);
        }
    }

    const mutationDeleteTodo = useMutation({
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
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })


    if (mutationDeleteTodo.isError) {
        console.error("deletion has failed, error")
    }


    return (
        <div className="todoEntry-desc-delete">
            {/* <TrashIcon className="todoEntry-desc-delete-button" onClick={() => deleteTodo(currentTodo.id)} /> */}
            <TrashIcon className="todoEntry-desc-delete-button" onClick={() => mutationDeleteTodo.mutate(currentTodo.id)} />

        </div >
    );
}
export default TodoDeleteButton;