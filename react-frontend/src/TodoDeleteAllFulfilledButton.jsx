import "./TodoDeleteAllFulfilledButton.css"
import { useMutateDAFT } from "./api/queriesAndMutations";

const TodoDeleteAllFulfilledButton = () => {

    const mutateDAFT = useMutateDAFT();

    return (
        <div className="daft-button-container">
            <button className="daft-button" onClick={mutateDAFT.mutate}> clear all </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;