import "./TodoDeleteAllFulfilledButton.css"
import { useMutateDAFT } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import { useContext } from "react";


const TodoDeleteAllFulfilledButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

    const mutateDAFT = useMutateDAFT();

    return (
        <div className="daft-button-container">
            <button className="daft-button" onClick={() => mutateDAFT.mutate({ userid: todoFuncAndData.userIDref.current })}> clear all </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;