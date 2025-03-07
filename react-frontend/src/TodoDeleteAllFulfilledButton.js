import "./TodoDeleteAllFulfilledButton.css"

const TodoDeleteAllFulfilledButton = ({ updateList, activeHeaders }) => {

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

            updateList();

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={`daft-button-container ${activeHeaders.includes("header-fulfilled") ? "visible" : ""} `}>
            <button className="daft-button" onClick={() => deleteAllFulfilledTodos()}> clear all </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;