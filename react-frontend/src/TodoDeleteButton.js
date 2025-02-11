import "./TodoDeleteButton.css"

const TodoDeleteButton = ({ currentTodo, updateList }) => {

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

            console.log("deleteResponse: " + response.status);

            if (!response.ok) {
                throw new Error("Error - Response Status:" + response.status);
            }

            updateList();

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="todoEntry-desc-delete">
            <button className="todoEntry-desc-delete-button" onClick={() => deleteTodo(currentTodo.id)}>  </button>
        </div >
    );
}
export default TodoDeleteButton;