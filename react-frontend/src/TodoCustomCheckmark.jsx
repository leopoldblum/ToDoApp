import { useEffect, useState, useContext, useRef } from "react"
import { useMutationEditTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";


const TodoCustomCheckmark = ({ currentTodo, checked }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const [isChecked, setIsChecked] = useState(null);

    const mutationEditTodo = useMutationEditTodo();

    const hasTransitionStartedRef = useRef(true)

    useEffect(() => {
        setIsChecked(checked);
    }, [checked])

    const handleClick = () => {
        hasTransitionStartedRef.current = false
        setIsChecked(prev => !prev);
    };

    const handleTransitionEnd = () => {

        if (!hasTransitionStartedRef.current) {

            mutationEditTodo.mutate({
                id: currentTodo.id,
                title: currentTodo.title,
                desc: currentTodo.desc,
                fulfilled: !currentTodo.fulfilled,
                userid: todoFuncAndData.userIDref.current
            });

            hasTransitionStartedRef.current = true
        }
    };

    return (
        <div className="flex justify-center items-center min-w-15">


            <div className="w-10 h-10 relative font-medium cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out" onClick={handleClick} onTransitionEnd={handleTransitionEnd}>

                <img
                    className={`absolute inset-0 object-cover transition-all duration-500 ease-in-out ${isChecked ? "opacity-0 scale-50 rotate-20" : "opacity-100 scale-100"}`}
                    src={"/box-unchecked.svg"}
                    alt="unchecked checkbox"
                />

                <img
                    className={`absolute inset-0 object-cover transition-all duration-500 ease-in-out ${!isChecked ? "opacity-0 scale-50 rotate-20 " : "opacity-100 scale-100"}`}
                    src={"/box-checked.svg"}
                    alt="checked checkbox"
                />

            </div>

        </div>
    )
}

export default TodoCustomCheckmark;