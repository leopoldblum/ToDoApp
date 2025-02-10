import "./TodoAddButton.css"

const TodoAddButton = (({ funcUpdateList }) => {

    function togglePopupForm() {
        const getFormContainer = document.getElementById("that-addTodoForm-popup-container")

        if (getFormContainer.classList.contains("hidden")) {
            getFormContainer.classList.remove("hidden");
            getFormContainer.classList.add("visible");

            getFormContainer.scrollIntoView({ behavior: "smooth", block: "center" })

        }
        else {
            getFormContainer.classList.remove("visible");
            getFormContainer.classList.add("hidden");
        }
    }



    const submitTodo = async (e) => {
        e.preventDefault();

        var titleElem =
            document.getElementById("myTodoForm-title");

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

            //togglePopupForm();

            funcUpdateList();

        } catch (error) {
            console.error(error);
        }
    }

    // pop up

    // title + desc eingeben

    // add! bzw. close

    // ??? profit

    return (
        <div className="addTodoForm-container" v>

            <button className="openPopup-button" id="openPopup-button" onClick={togglePopupForm}>
                - add a new todo -
            </button>

            <div className="hidden" id="that-addTodoForm-popup-container">
                <form className="addTodoForm " id="myTodoForm" onSubmit={submitTodo}>

                    <input type="text" className="addTodoForm-input" id="myTodoForm-title" placeholder="title" autoComplete="off" required />
                    <br />
                    {/* <input type="text" className="addTodoForm-input" id="myTodoForm-desc" placeholder="description" autoComplete="off" /> */}
                    <br />
                    <textarea type="text" className="addTodoForm-desc" id="myTodoForm-desc" form="addTodoForm" placeholder="description" autoComplete="off" autoCorrect="off" spellCheck="off" />
                    <br />
                    <input type="submit" className="addTodoForm-submitButton" value={"add!"} />
                </form>
            </div>

        </div>
    );
})

export default TodoAddButton
