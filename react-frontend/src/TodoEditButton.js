import "./TodoEditButton.css"
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon.js"




const TodoEditButton = ({ currentTodo, updateList }) => {

    return (
        <div className="todo-entry-edit-container">
            <PencilSquareIcon className="todo-entry-edit-button" />
        </div>
    )
}

export default TodoEditButton;