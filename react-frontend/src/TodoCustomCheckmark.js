import { useEffect, useRef, useState, useContext } from "react"
import { todoListProvider } from "./TodoList-Wrapper";
import "./TodoCustomCheckmark.css"

const TodoCustomCheckmark = ({ currentTodo, checked }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const [isChecked, setIsChecked] = useState(null);

    const checkedBoxRef = useRef();
    const uncheckedBoxRef = useRef();

    useEffect(() => {
        setIsChecked(checked);
    }, [checked])



    function toggleButtonWithStates() {
        setIsChecked(prev => !prev);
        uncheckedBoxRef.current.classList.add("shake");
        checkedBoxRef.current.classList.add("shake");


        uncheckedBoxRef.current.addEventListener('transitionend', () => {
            todoToggleFulfill(currentTodo.id);
        }, { once: true })
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

            todoFuncAndData.updateList();
        } catch (error) {
            console.error(error);
        }

    }


    return (
        <div className="custom-checkmark-container">

            <img
                className={`checkmark-button ${isChecked ? "" : "hidden"}`}
                ref={checkedBoxRef}
                onClick={toggleButtonWithStates}
                src="/box-checked.svg"
                alt="checked checkbox"
            />

            <img
                className={`checkmark-button ${!isChecked ? "" : "hidden"}`}
                ref={uncheckedBoxRef}
                onClick={toggleButtonWithStates}
                src="/box-unchecked.svg"
                alt="unchecked checkbox"
            />

        </div>
    )
}

export default TodoCustomCheckmark;