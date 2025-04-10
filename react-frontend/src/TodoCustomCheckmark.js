import { useEffect, useRef, useState, useContext } from "react"
import { todoListProvider } from "./TodoList-Wrapper";
import "./TodoCustomCheckmark.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoCustomCheckmark = ({ currentTodo, checked }) => {

    const todoFuncAndData = useContext(todoListProvider);
    const queryClient = useQueryClient()


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

        // Beide Methoden kombinieren: Event-Listener und Fallback-Timer
        let mutationTriggered = false;

        const triggerMutation = () => {
            if (!mutationTriggered) {
                mutationTriggered = true;
                mutateCheckbox.mutate(currentTodo.id);
            }
        };

        // Event-Listener für beide Elemente
        const handleTransitionEnd = () => triggerMutation();

        uncheckedBoxRef.current.addEventListener('transitionend', handleTransitionEnd, { once: true });
        checkedBoxRef.current.addEventListener('transitionend', handleTransitionEnd, { once: true });

        // Sicherheits-Timer, der in jedem Fall ausgelöst wird
        // setTimeout(triggerMutation, 350);

        // Animations-Klassen entfernen (für zukünftige Animationen)
        setTimeout(() => {
            uncheckedBoxRef.current?.classList.remove("shake");
            checkedBoxRef.current?.classList.remove("shake");
        }, 400);
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

    const mutateCheckbox = useMutation({
        mutationFn: (todoID) => todoToggleFulfill(todoID),

        onMutate: async () => {
            // optimistically toggling checkbox of todo

            const todoBody = { id: currentTodo.id, title: currentTodo.title, desc: currentTodo.desc, fulfilled: !currentTodo.fulfilled };

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos'])

            // console.log("before: " + JSON.stringify(queryClient.getQueryData(['todos'])))

            queryClient.setQueryData(['todos'], (old) => old.map((todo) => todo.id === currentTodo.id ? todoBody : todo))

            // console.log("after: " + JSON.stringify(queryClient.getQueryData(['todos'])))

            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos)
            // todoFuncAndData.setTodos(context.previousTodos)
            console.log("error occured: " + err)

        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })

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