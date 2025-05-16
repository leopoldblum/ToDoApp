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
        <button className="w-full h-full flex justify-center items-center pl-6 pr-6 pt-4 pb-4 cursor-pointer hover:text-text-hover-lm hover:scale-95 transition-all duration-500 ease-in-out"
            onClick={() => mutationDeleteTodo.mutate({
                todoID: currentTodo.id,
                userid: todoFuncAndData.userIDref.current
            })}
        >

            <TrashIcon className="h-8 w-8 font-medium " />

        </button >
    );
}
export default TodoDeleteButton;