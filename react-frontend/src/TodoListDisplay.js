import "./TodoListDisplay.css"
import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";
import TodoEditOrAddButton from "./TodoEditOrAddButton";

const TodoListDisplay = ({ displayFulfilled, todos, activeTodos, toggleDesc, updateList }) => {

    if (displayFulfilled === false) {

        return (
            <div className="all-todos-container">

                {todos != null && todos.filter(entries => entries.fulfilled === false).map((entries) => (

                    <div className='todoEntry-container' key={entries.id}>

                        <div className="todoEntry-box todo-title" onClick={() => toggleDesc(entries.id)}> {entries.title} </div>

                        <div className="todoEntry-box">
                            <div className="todoEntry-box-placeholder-container">
                                <TodoEditOrAddButton isEdit={true} currentTodo={entries} updateList={updateList} />
                            </div>

                            <div className="todoEntry-box-placeholder-container">
                                <TodoDeleteButton currentTodo={entries} updateList={updateList} />
                            </div>

                            <div className="todoEntry-box-placeholder-container checkbox">
                                <TodoCustomCheckmark currentTodo={entries} updateList={updateList} checked={displayFulfilled} />
                            </div>

                        </div>

                        <div className={`todoEntry-desc-popup ${activeTodos.includes(entries.id) ? "visible" : "hidden"}`}>
                            <div className="todoEntry-desc-text">
                                <p>{entries.desc}</p>
                            </div>
                        </div>

                    </div>
                ))
                }
            </div>
        )

    }
    else {

        return (
            <div className="all-todos-container">
                {todos != null && todos.filter(entries => entries.fulfilled === true).map((entries) => (

                    <div className='todoEntry-container todoEntryCompleted-container' key={entries.id}>

                        <div className="todoEntry-box todo-title todo-title-linethrough " onClick={() => toggleDesc(entries.id)}>  {entries.title}  </div>


                        <div className="todoEntry-box">
                            <div className="todoEntry-box-placeholder-container">
                                <TodoEditOrAddButton isEdit={true} currentTodo={entries} updateList={updateList} />
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
}

export default TodoListDisplay;