import "./TodoCustomCheckmark.css"

const TodoCustomCheckmark = ({ currentTodo, updateList, checked }) => {

    const checked_button_id = `${currentTodo.id}-checked-button`
    const unchecked_button_id = `${currentTodo.id}-unchecked-button`

    function toggleButtonSwitcharoo() {
        var b1 = document.getElementById(unchecked_button_id)
        var b2 = document.getElementById(checked_button_id)

        b1.classList.toggle("hidden");
        b2.classList.toggle("hidden")

        b1.classList.toggle("shake")
        b2.classList.toggle("shake")

        b1.ontransitionend = () => {

            // backend shit here
            todoToggleFulfill(currentTodo.id)
        }
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

            updateList();
        } catch (error) {
            console.error(error);
        }

    }

    if (checked) {
        // Todo is fulfilled -> checked checkbox
        return (
            <div className="custom-checkmark-container">
                <img id={checked_button_id} className="checkmark-button" onClick={toggleButtonSwitcharoo} src="/box-checked.svg" alt="ticked checkbox" />
                <img id={unchecked_button_id} className="checkmark-button hidden" onClick={toggleButtonSwitcharoo} src="/box-unchecked.svg" alt="unticked checkbox" />
            </div>
        )
    }
    else {
        // Todo is unfulfilled -> unchecked checkbox

        return (
            <div className="custom-checkmark-container">
                <img id={checked_button_id} className="checkmark-button hidden" onClick={toggleButtonSwitcharoo} src="/box-checked.svg" alt="ticked checkbox" />
                <img id={unchecked_button_id} className="checkmark-button" onClick={toggleButtonSwitcharoo} src="/box-unchecked.svg" alt="unticked checkbox" />
            </div>
        )
    }

}

export default TodoCustomCheckmark;