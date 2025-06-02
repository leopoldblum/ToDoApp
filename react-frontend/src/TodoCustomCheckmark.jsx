import { useEffect, useState, useContext, useRef } from "react"
import { useMutationEditTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";


const TodoCustomCheckmark = ({ currentTodo, checked }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const [isChecked, setIsChecked] = useState(null);

    const mutationEditTodo = useMutationEditTodo();

    const hasTransitionStartedRef = useRef(false)

    useEffect(() => {
        setIsChecked(checked);
    }, [checked])

    const handleClick = () => {
        hasTransitionStartedRef.current = true
        setIsChecked(prev => !prev);
    };

    const handleTransitionEnd = (e) => {

        if ((e.propertyName !== "opacity" && e.propertyName !== "transform") || !hasTransitionStartedRef.current) return;

        mutationEditTodo.mutate({
            id: currentTodo.id,
            title: currentTodo.title,
            desc: currentTodo.desc,
            fulfilled: !currentTodo.fulfilled,
            userid: todoFuncAndData.userIDref.current,
            optimisticid: currentTodo.optimisticid
        });

        hasTransitionStartedRef.current = false

    };

    return (
        <div className="flex justify-center items-center w-full ">


            <button className={`flex justify-center items-center lg:p-4 p-2 relative font-medium cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out group ${hasTransitionStartedRef.current ? "pointer-events-none" : ""}`}
                onClick={handleClick}
                onTransitionEnd={handleTransitionEnd}
            >
                <div className="relative w-6 h-6 lg:w-8 lg:h-8">

                    <svg
                        className={`absolute inset-0 object-cover transition-all duration-300 ease-in-out group-hover:text-text-hover-lm  ${!isChecked ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-45"} `}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                    </svg>


                    <svg
                        className={`absolute inset-0 object-cover transition-all duration-300 ease-in-out group-hover:text-text-hover-lm ${isChecked ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-45"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </div>


            </button>

        </div>
    )
}

export default TodoCustomCheckmark;