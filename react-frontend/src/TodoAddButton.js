import React from "react";
import "./TodoAddButton.css"

const TodoAddButton = (() => {

    function togglePopupForm() {
        const getMyFormPopup = document.getElementById("myTodoForm")

        if (getMyFormPopup.style.display === "") {
            getMyFormPopup.style.display = "block"

        }
        else {
            getMyFormPopup.style.display = ""

            var inputs = document.getElementById("myTodoForm")
            inputs.reset();
        }
    }

    // pop up

    // title + desc eingeben

    // add! bzw. close

    // ??? profit

    return (
        <div>

            <button className="openPopup-button" id="openPopup-button" onClick={togglePopupForm}>
                pop up my todo form
            </button>

            <div>
                <form className="addTodoForm" id="myTodoForm">
                    <input className="addTodoForm-input" type="text" placeholder="title" required />
                    <br />
                    <input className="addTodoForm-input" type="text" placeholder="description" required />
                </form>
            </div>

        </div>
    );
})

export default TodoAddButton
