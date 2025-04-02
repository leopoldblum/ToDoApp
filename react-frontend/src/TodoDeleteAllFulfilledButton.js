import "./TodoDeleteAllFulfilledButton.css"
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoDeleteAllFulfilledButton = () => {

    const todoFuncAndData = useContext(todoListProvider);


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

            todoFuncAndData.updateList();

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="daft-button-container">
            <button className="daft-button" onClick={() => deleteAllFulfilledTodos()}> clear all </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;