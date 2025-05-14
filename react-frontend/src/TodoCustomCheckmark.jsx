import { useEffect, useState, useContext } from "react"
import { useMutationEditTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";


const TodoCustomCheckmark = ({ currentTodo, checked }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const [isChecked, setIsChecked] = useState(null);

    const mutationEditTodo = useMutationEditTodo();

    useEffect(() => {
        setIsChecked(checked);
    }, [checked])


    function toggleButtonWithStates() {
        setIsChecked(prev => !prev);

        mutationEditTodo.mutate({
            id: currentTodo.id,
            title: currentTodo.title,
            desc: currentTodo.desc,
            fulfilled: !currentTodo.fulfilled,
            userid: todoFuncAndData.userIDref.current
        });
    }


    return (
        <div className="flex justify-center items-center min-w-15">

            <img
                className={`border-none select-none transition-all duration-500 cursor-pointer p-2 invert-90`}
                onClick={toggleButtonWithStates}
                src={isChecked ? "/box-checked.svg" : "/box-unchecked.svg"}
                alt="checkbox"
            />

        </div>
    )
}

export default TodoCustomCheckmark;