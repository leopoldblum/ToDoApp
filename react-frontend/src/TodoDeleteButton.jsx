import TrashIcon from "@heroicons/react/24/outline/TrashIcon.js"
import { useMutationDeleteTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import { useContext } from "react";



const TodoDeleteButton = ({ currentTodo }) => {

    const todoFuncAndData = useContext(todoListProvider);
    const mutationDeleteTodo = useMutationDeleteTodo();


    if (mutationDeleteTodo.isError) {
        console.error("deletion has failed, error")
        throw new Error("deletion has failed: " + mutationDeleteTodo.error)
    }

    return (
        <button className="w-full h-full flex justify-center items-center p-2 lg:p-4 cursor-pointer hover:text-text-hover-lm hover:scale-95 transition-all duration-300 ease-in-out"
            onClick={() => mutationDeleteTodo.mutate({
                todoID: currentTodo.id,
                userid: todoFuncAndData.userIDref.current
            })}
        >

            <TrashIcon className="h-6 w-6 lg:h-8 lg:w-8" />

        </button >
    );
}
export default TodoDeleteButton;