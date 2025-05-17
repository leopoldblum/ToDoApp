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
        <div className="flex justify-center items-center min-w-15 ">


            <div className="flex justify-center items-center w-9 h-9 relative font-medium cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out "
                onClick={handleClick}
            // onTransitionEnd={handleTransitionEnd}
            >

                <div className={`absolute inset-0 object-cover transition-all duration-500 ease-in-out  ${isChecked ? "opacity-0 scale-50 rotate-20" : "opacity-100 scale-100"}`}
                    onTransitionEnd={handleTransitionEnd}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
                </div>

                <div className={`absolute inset-0 object-cover transition-all duration-500 ease-in-out ${!isChecked ? "opacity-0 scale-50 rotate-20 " : "opacity-100 scale-100"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                </div>

            </div>

        </div>
    )
}

export default TodoCustomCheckmark;