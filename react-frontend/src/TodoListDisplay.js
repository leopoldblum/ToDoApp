import "./TodoListDisplay.css"
import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";
import TodoEditOrAddButton from "./TodoEditOrAddButton";

const TodoListDisplay = ({ displayFulfilled, todos, activeTodos, toggleDesc, updateList }) => {

    return (
        <div className="all-todos-container">
            {todos != null && todos.filter(entries => entries.fulfilled === displayFulfilled).map((entries) => (

                <div className={`todoEntry-container ${displayFulfilled ? "todoEntryCompleted-container" : ""}`} key={entries.id}>

                    <div className={`todoEntry-box todo-title ${displayFulfilled ? "todo-title-linethrough" : ""}`} onClick={() => toggleDesc(entries.id)}>
                        {entries.title}
                    </div>


                    <div className="todoEntry-box">
                        <div className="todoEntry-box-placeholder-container">
                            <TodoEditOrAddButton currentTodo={entries} updateList={updateList} />
                        </div>

                        <div className="todoEntry-box-placeholder-container">
                            <TodoDeleteButton currentTodo={entries} updateList={updateList} />
                        </div>

                        <div className="todoEntry-box-placeholder-container checkbox">
                            <TodoCustomCheckmark currentTodo={entries} updateList={updateList} checked={displayFulfilled} />
                        </div>

                    </div>

                    <div className={`todoEntry-desc-popup ${activeTodos.includes(entries.id) ? "visible" : "hidden"}`}>
                        <div className="todoEntry-desc-text">{entries.desc}</div>
                    </div>

                </div>
            ))
            }
        </div>
    )

}


export default TodoListDisplay;