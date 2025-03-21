import "./TodoAddButton.css"
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon.js"

const TodoAddButton = (({ funcUpdateList }) => {

    function toggleModal(modalID) {
        let modal = document.getElementById(modalID)
        if (modal.open) {
            modal.close();
        }
        else {
            modal.showModal();
        }
    }

    const submitTodo = async (e) => {
        e.preventDefault();

        var titleElem = document.getElementById("myTodoForm-title");
        var descElem = document.getElementById("myTodoForm-desc");

        const todoBody = { title: titleElem.value, desc: descElem.value, fulfilled: false };

        // alert("adding: " + JSON.stringify(todoBody));
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

            console.log("postNewTodoResponse: " + postNewTodoResponse.status);

            if (!postNewTodoResponse.ok) {
                throw new Error(
                    "Error - Response Status:" + postNewTodoResponse.status,
                );
            }

            titleElem.value = "";
            descElem.value = "";
            toggleModal("add-todo-modal")
            funcUpdateList();

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="addTodoForm-container">

            <button className="openPopup-button" id="openPopup-button" onClick={() => toggleModal("add-todo-modal")}>
                add a new todo
            </button>

            <dialog id="add-todo-modal">

                <div className="add-todo-modal-title-container">

                    <div className="add-todo-modal-title">
                        new todo
                    </div>


                    <div className="add-todo-modal-close-button-container">
                        <XMarkIcon className="add-todo-modal-close-button" onClick={() => toggleModal("add-todo-modal")} />
                    </div>

                </div>

                <div className="todo-modal-content-container">

                    <form className="addTodoForm " id="myTodoForm" onSubmit={submitTodo}>
                        <input type="text" className="addTodoForm-input" id="myTodoForm-title" placeholder="title" autoComplete="off" required />
                        <br />
                        <textarea type="text" className="addTodoForm-desc" id="myTodoForm-desc" form="addTodoForm" placeholder="description" autoComplete="off" autoCorrect="off" spellCheck="off" />
                        <br />
                        <input type="submit" className="addTodoForm-submitButton" value={"add!"} />
                    </form>

                </div>

            </dialog>
        </div>
    );
})

export default TodoAddButton




