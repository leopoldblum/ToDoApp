import "./TodoAddButton.css"

const TodoAddButton = (({ funcUpdateList }) => {

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



    const submitTodo = async (e) => {
        e.preventDefault();

        var title =
            document.getElementById("myTodoForm-title").value;

        var desc = document.getElementById("myTodoForm-desc").value;

        const todoBody = { title: title, desc: desc, fulfilled: false };

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
            togglePopupForm();

            funcUpdateList();

            // setTimeout(funcUpdateList, 500);


        } catch (error) {
            console.error(error);
        }
    }

    // pop up

    // title + desc eingeben

    // add! bzw. close

    // ??? profit

    return (
        <div>

            <button className="openPopup-button" id="openPopup-button" onClick={togglePopupForm}>
                - add a new todo -
            </button>

            <div>
                <form className="addTodoForm" id="myTodoForm" onSubmit={submitTodo}>

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
