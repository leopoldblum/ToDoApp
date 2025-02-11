import "./TodoListDisplay.css"
import TodoCheckmarkButton from "./TodoCheckmarkButton";
import TodoDeleteButton from "./TodoDeleteButton";

const TodoListDisplay = ({ displayFulfilled, todos, activeTodos, toggleDesc, updateList }) => {

    if (displayFulfilled === false) {

        return (
            <div id="all-active-todos-container" className='hidden'>
                {todos != null && todos.filter(entries => entries.fulfilled === false).map((entries) => (

                    <div className='todoEntry-container' key={entries.id}>

                        <div className="todoEntry-box todo-title" onClick={() => toggleDesc(entries.id)}> {entries.title} </div>

                        <div className="todoEntry-box"> <TodoCheckmarkButton currentTodo={entries} funcUpdateList={updateList} /> </div>

                        {/* statt komplett neu zu rendern, lieber visibility togglen, das erlaubt transitions */}

                        {activeTodos.includes(entries.id) && (
                            <div className="todoEntry-desc-popup">
                                <div className="todoEntry-desc-text">{entries.desc}</div>
                                {/* <div className="todoEntry-desc-delete">  delete   </div> */}
                                <TodoDeleteButton currentTodo={entries} updateList={updateList} />
                            </div>
                        )}

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

                        <div className="todoEntry-box"> <TodoCheckmarkButton currentTodo={entries} funcUpdateList={updateList} /> </div>

                        {/* statt komplett neu zu rendern, lieber visibility togglen, das erlaubt transitions */}
                        {activeTodos.includes(entries.id) && (
                            <div className="todoEntry-desc-popup">
                                <div className="todoEntry-desc-text">{entries.desc}</div>
                                <TodoDeleteButton currentTodo={entries} funcUpdateList={updateList} />
                            </div>
                        )}
                    </div>
                ))
                }
            </div>
        )

    }
}

export default TodoListDisplay;