import "./TodoList.css"
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';

const TodoList = ({ isFulfilled, activeTodos, todos, activeHeaders, toggleHeaderState, toggleCollapseAllDesc, toggleDesc, updateList }) => {

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"

    return (
        <div>
            <div className='section-todos-header' >

                <div className={`section-todos-header-icon  ${activeHeaders.includes(headerType) ? "active" : ""} `}>
                    &gt;
                </div>

                <div className='section-todos-header-title' onClick={() => toggleHeaderState(headerType)} >
                    {!isFulfilled && <h1> active todos </h1>}
                    {isFulfilled && <h1> fulfilled todos </h1>}

                </div>

                <div className={`header-button-container toggle-visibility-container ${activeHeaders.includes(headerType) ? "visible" : ""}`}>
                    {!isFulfilled && <CollapseButton toggleCollapseAllDesc={toggleCollapseAllDesc} />}
                    {isFulfilled && <TodoDeleteAllFulfilledButton updateList={updateList} activeHeaders={activeHeaders} />}
                </div>

            </div>

            <div className={`toggle-visibility-container ${activeHeaders.includes(headerType) ? "visible" : ""}`}>
                {!isFulfilled && <TodoListDisplay displayFulfilled={false} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} />}
                {isFulfilled && <TodoListDisplay displayFulfilled={true} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} />}
            </div>
        </div>
    )
}

export default TodoList;