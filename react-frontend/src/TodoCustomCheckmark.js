import { useEffect, useRef, useState } from "react"
import "./TodoCustomCheckmark.css"
import { useMutateCheckbox } from "./api/queryHooksAndMutations";

const TodoCustomCheckmark = ({ currentTodo, checked }) => {

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

        setTimeout(() => {
            uncheckedBoxRef.current?.classList.remove("shake");
            checkedBoxRef.current?.classList.remove("shake");
        }, 400);
    }

    const mutateCheckbox = useMutateCheckbox(currentTodo);

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