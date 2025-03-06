import "./TodoListDisplay.css"
import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";

const TodoListDisplay = ({ displayFulfilled, todos, activeTodos, toggleDesc, updateList }) => {

    if (displayFulfilled === false) {

        return (
            <div id="all-active-todos-container" className='hidden'>
                {todos != null && todos.filter(entries => entries.fulfilled === false).map((entries) => (

                    <div className='todoEntry-container' key={entries.id}>

                        <div className="todoEntry-box todo-title" onClick={() => toggleDesc(entries.id)}> {entries.title} </div>

                        <div className="todoEntry-box">
                            <TodoCustomCheckmark currentTodo={entries} updateList={updateList} checked={displayFulfilled} />
                        </div>

                        <div className={`todoEntry-desc-popup ${activeTodos.includes(entries.id) ? "visible" : "hidden"}`}>
                            <div className="todoEntry-desc-text">{entries.desc}</div>
                            <TodoDeleteButton currentTodo={entries} updateList={updateList} />
                        </div>

                    </div>
                ))
                }
            </div>
        )

    }
    else {

        return (
            <div id="all-fulfilled-todos-container" className='hidden'>
                {todos != null && todos.filter(entries => entries.fulfilled === true).map((entries) => (

                    <div className='todoEntry-container todoEntryCompleted-container' key={entries.id}>

                        <div className="todoEntry-box todo-title todo-title-linethrough " onClick={() => toggleDesc(entries.id)}  >  {entries.title}  </div>

                        <div className="todoEntry-box">
                            {/* <TodoCheckmarkButton currentTodo={entries} funcUpdateList={updateList} /> */}
                            <TodoCustomCheckmark currentTodo={entries} updateList={updateList} checked={displayFulfilled} />
                        </div>

                        {/* statt komplett neu zu rendern, lieber visibility togglen, das erlaubt transitions -> juckt gerade nicht? */}

                        <div className={`todoEntry-desc-popup ${activeTodos.includes(entries.id) ? "visible" : "hidden"}`}>
                            <div className="todoEntry-desc-text">{entries.desc}</div>
                            <TodoDeleteButton currentTodo={entries} updateList={updateList} />
                        </div>

                    </div>
                ))
                }
            </div>
        )

    }
}

export default TodoListDisplay;