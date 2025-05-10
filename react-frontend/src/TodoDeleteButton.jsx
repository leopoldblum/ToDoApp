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
        <div className="h-full w-full flex items-center justify-center bg-amber-300/30">

            <TrashIcon
                className="h-2/3 w-2/3 p-4 cursor-pointer bg-amber-950/30 hover:text-red-400 transition-all duration-200 ease-in-out"
                onClick={() => mutationDeleteTodo.mutate({
                    todoID: currentTodo.id,
                    userid: todoFuncAndData.userIDref.current
                })} />

        </div >
    );
}
export default TodoDeleteButton;