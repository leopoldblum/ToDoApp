// import "./TodoDeleteAllFulfilledButton.css"
import { useMutateDAFT } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import { useContext } from "react";


const TodoDeleteAllFulfilledButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

    const mutateDAFT = useMutateDAFT();

    return (
        <div className="w-full">
            <button
                className="w-3/4 bg-amber-800 text-gray-100 font-medium pl-4 pr-4 pt-3 pb-3 border-0 rounded-md hover:bg-emerald-300 hover:cursor-pointer transition duration-500 hover:scale-95"
                onClick={() => mutateDAFT.mutate({ userid: todoFuncAndData.userIDref.current })}> clear all </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;