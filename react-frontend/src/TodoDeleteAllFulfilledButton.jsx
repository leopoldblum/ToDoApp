// import "./TodoDeleteAllFulfilledButton.css"
import { useMutateDAFT } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import { useContext } from "react";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/outline/ArchiveBoxXMarkIcon.js"
import HeaderButtonLayout from "./HeaderButtonLayout.jsx"



const TodoDeleteAllFulfilledButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

    const mutateDAFT = useMutateDAFT();

    return (
        <HeaderButtonLayout onClick={() => mutateDAFT.mutate({ userid: todoFuncAndData.userIDref.current })}>
            <ArchiveBoxXMarkIcon className={` absolute inset-0 object-cover transition-all duration-300 ease-in-out`} />
        </HeaderButtonLayout>
    )
}

export default TodoDeleteAllFulfilledButton;