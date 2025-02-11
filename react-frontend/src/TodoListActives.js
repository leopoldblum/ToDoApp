import "./TodoListActives.css"
import TodoCheckmarkButton from "./TodoCheckmarkButton";
import TodoDeleteButton from "./TodoDeleteButton";

const TodoListActives = ({ todos, activeTodos, toggleDesc, updateList }) => {

    return (

        <div id="all-active-todos-container" className='visible'>
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

export default TodoListActives;