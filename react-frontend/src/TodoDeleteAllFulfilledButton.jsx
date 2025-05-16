// import "./TodoDeleteAllFulfilledButton.css"
import { useMutateDAFT } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import { useContext } from "react";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/outline/ArchiveBoxXMarkIcon.js"


const TodoDeleteAllFulfilledButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

    const mutateDAFT = useMutateDAFT();

    return (

        <div className="w-full h-full flex justify-center items-center ">

            <div className="pl-6 pr-6 pt-4 pb-4 rounded-md hover:text-text-hover-lm hover:cursor-pointer transition duration-500 hover:scale-95"
                onClick={() => mutateDAFT.mutate({ userid: todoFuncAndData.userIDref.current })}>

                <div className="w-8 h-8 relative font-medium ">
                    <ArchiveBoxXMarkIcon className={` absolute inset-0 object-cover transition-all duration-500 ease-in-out`} />
                </div>


            </div>
        </div>
    )
}

export default TodoDeleteAllFulfilledButton;