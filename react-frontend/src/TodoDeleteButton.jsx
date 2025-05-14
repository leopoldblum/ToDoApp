import TrashIcon from "@heroicons/react/16/solid/TrashIcon.js"
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
        <div className="w-full flex justify-center items-center">

            <TrashIcon
                className="w-15 p-4 cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out"
                onClick={() => mutationDeleteTodo.mutate({
                    todoID: currentTodo.id,
                    userid: todoFuncAndData.userIDref.current
                })} />

        </div >
    );
}
export default TodoDeleteButton;