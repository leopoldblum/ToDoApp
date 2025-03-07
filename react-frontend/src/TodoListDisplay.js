import "./TodoListDisplay.css"
import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";

const TodoListDisplay = ({ displayFulfilled, todos, activeTodos, toggleDesc, updateList, activeHeaders }) => {

    if (displayFulfilled === false) {

        return (
            <div id="all-active-todos-container" className={`${activeHeaders.includes("header-actives") ? "visible" : ""} `}>
                {todos != null && todos.filter(entries => entries.fulfilled === false).map((entries) => (

                    <div className='todoEntry-container' key={entries.id}>

                        <div className="todoEntry-box todo-title" onClick={() => toggleDesc(entries.id)}> {entries.title} </div>

                        <div className="todoEntry-box">
                            <TodoCustomCheckmark currentTodo={entries} updateList={updateList} checked={displayFulfilled} />
                        </div>

                        {/* change desc-popup so that it's outside this div, so that it doesnt have this ass background when transitioning */}
                        <div className={`todoEntry-desc-popup ${activeTodos.includes(entries.id) ? "visible" : "hidden"}`}>
                            <div className="todoEntry-desc-text">{entries.desc}</div>
                            <TodoDeleteButton currentTodo={entries} updateList={updateList} />
                        </div>

                    </div>
                ))
                }

                {/* put desc-popup here */}
            </div>
        )

    }
    else {

        return (
            <div id="all-fulfilled-todos-container" className={`${activeHeaders.includes("header-fulfilled") ? "visible" : ""} `}>
                {todos != null && todos.filter(entries => entries.fulfilled === true).map((entries) => (

                    <div className='todoEntry-container todoEntryCompleted-container' key={entries.id}>

                        <div className="todoEntry-box todo-title todo-title-linethrough " onClick={() => toggleDesc(entries.id)}>  {entries.title}  </div>

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