import "./TodoDeleteButton.css"
import TrashIcon from "@heroicons/react/16/solid/TrashIcon.js"
import { useMutationDeleteTodo } from "./api/queriesAndMutations";

const TodoDeleteButton = ({ currentTodo }) => {

    const mutationDeleteTodo = useMutationDeleteTodo();

    if (mutationDeleteTodo.isError) {
        console.error("deletion has failed, error")
        throw new Error("deletion has failed: " + mutationDeleteTodo.error)
    }

    return (
        <div className="todoEntry-desc-delete">

            <TrashIcon className="todoEntry-desc-delete-button" onClick={() => mutationDeleteTodo.mutate(currentTodo.id)} />

        </div >
    );
}
export default TodoDeleteButton;