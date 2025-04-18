import "./TodoListAndHeader.css"
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoListAndHeader = ({ isFulfilled }) => {

    const todoFuncAndData = useContext(todoListProvider);
    // useContext instead of passing down all the props

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"




    /**
  * @param {string} header_type options: "header-active" "header-fulfilled" 
  * 
  * toggles given header_type in activeHeaders
  */

    const toggleHeaderState = (header_type) => {
        todoFuncAndData.setActiveHeaders((currentActiveHeaders) => {
            if (currentActiveHeaders.includes(header_type)) {
                return currentActiveHeaders.filter((activeHeader) => activeHeader !== header_type);
            }
            else {
                return [...currentActiveHeaders, header_type];
            }
        })
    }

    return (
        <div>
            <div className='section-todos-header' >

                <div className={`section-todos-header-icon  ${todoFuncAndData.activeHeaders.includes(headerType) ? "active" : ""} `}>
                    &gt;
                </div>

                <div className='section-todos-header-title' onClick={() => toggleHeaderState(headerType)} >
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
                <TodoListDisplay displayFulfilled={isFulfilled ? true : false} />
            </div>
        </div>
    )
}

export default TodoListAndHeader;