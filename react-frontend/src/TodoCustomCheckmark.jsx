import { useEffect, useRef, useState, useContext } from "react"
import "./TodoCustomCheckmark.css"
import { useMutationEditTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";


const TodoCustomCheckmark = ({ currentTodo, checked }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const [isChecked, setIsChecked] = useState(null);

    const checkedBoxRef = useRef();
    const uncheckedBoxRef = useRef();

    const mutationEditTodo = useMutationEditTodo();

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
                mutationEditTodo.mutate({
                    id: currentTodo.id,
                    title: currentTodo.title,
                    desc: currentTodo.desc,
                    fulfilled: !currentTodo.fulfilled,
                    userid: todoFuncAndData.userIDref.current
                })

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