import "./TodoListAndHeader.css"
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoList = ({ isFulfilled }) => {

    const todoFuncAndData = useContext(todoListProvider);
    // useContext instead of passing down all the props

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"

    return (
        <div>
            <div className='section-todos-header' >

                <div className={`section-todos-header-icon  ${todoFuncAndData.activeHeaders.includes(headerType) ? "active" : ""} `}>
                    &gt;
                </div>

                <div className='section-todos-header-title' onClick={() => todoFuncAndData.toggleHeaderState(headerType)} >
                    {isFulfilled ?
                        <h1> fulfilled todos </h1>
                        :
                        <h1> active todos </h1>
                    }
                </div>

                <div className={`header-button-container toggle-visibility-container ${todoFuncAndData.activeHeaders.includes(headerType) ? "visible" : ""}`}>
                    {isFulfilled ?
                        <TodoDeleteAllFulfilledButton />
                        :
                        <CollapseButton />
                    }
                </div>

            </div>

            <div className={`toggle-visibility-container ${todoFuncAndData.activeHeaders.includes(headerType) ? "visible" : ""}`}>
                <TodoListDisplay displayFulfilled={isFulfilled ? true : false} todos={todoFuncAndData.todos} descActiveTodos={todoFuncAndData.descActiveTodos} toggleDesc={todoFuncAndData.toggleDesc} updateList={todoFuncAndData.updateList} />
            </div>
        </div>
    )
}

export default TodoList;