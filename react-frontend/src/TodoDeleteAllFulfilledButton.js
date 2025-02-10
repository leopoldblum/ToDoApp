import "./TodoDeleteAllFulfilledButton.css"

const TodoDeleteAllFulfilledButton = () => {

    function func() {
        return alert("gay");
    }

    return (
        <div>
            <button onClick={() => func()}> lösch alle </button>
        </div >
    )
}

export default TodoDeleteAllFulfilledButton;