import "./TodoListAndHeader.css"
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoList = ({ isFulfilled, activeTodos, todos, activeHeaders, toggleHeaderState, toggleCollapseAllDesc, toggleDesc, updateList }) => {

    const data = useContext(todoListProvider);
    console.log(data.todos)
    // useContext instead of passing down all the props

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"

    return (
        <div>
            <div className='section-todos-header' >

                <div className={`section-todos-header-icon  ${activeHeaders.includes(headerType) ? "active" : ""} `}>
                    &gt;
                </div>

                <div className='section-todos-header-title' onClick={() => toggleHeaderState(headerType)} >
                    {isFulfilled ?
                        <h1> fulfilled todos </h1>
                        :
                        <h1> active todos </h1>
                    }
                </div>

                <div className={`header-button-container toggle-visibility-container ${activeHeaders.includes(headerType) ? "visible" : ""}`}>
                    {isFulfilled ?
                        <TodoDeleteAllFulfilledButton updateList={updateList} activeHeaders={activeHeaders} />
                        :
                        <CollapseButton toggleCollapseAllDesc={toggleCollapseAllDesc} />
                    }
                </div>

            </div>

            <div className={`toggle-visibility-container ${activeHeaders.includes(headerType) ? "visible" : ""}`}>
                <TodoListDisplay displayFulfilled={isFulfilled ? true : false} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} />
            </div>
        </div>
    )
}

export default TodoList;