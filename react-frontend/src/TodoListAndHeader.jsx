import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoListAndHeader = ({ isFulfilled }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"
    const isHeaderTypeActive = todoFuncAndData.activeHeaders.includes(headerType)
    const specificTodoCounter = todoFuncAndData.todos.filter(entries => entries.fulfilled === isFulfilled).length

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
            <div className='h-20 w-6/10 ml-auto mr-auto mt-8 flex items-center justify-center cursor-pointer border-[#321d34] border-b-2 border-l-2 rounded-bl-xs'>

                <div className={`flex-1/15  h-3/4 flex text-3xl justify-center items-center pointer-events-auto select-none transition-all duration-200 ease-in ${isHeaderTypeActive ? "rotate-90" : ""} `}>
                    &gt;
                </div>

                <div className='flex-11/15  h-3/4 text-left flex items-center select-none' onClick={() => toggleHeaderState(headerType)} >

                    <h1> {isFulfilled ? "fulfilled todos" : "active todos"}  ({specificTodoCounter}) </h1>

                </div>

                <div className={` flex-3/15 h-3/4 flex justify-center items-center text-[#321d34] transition-all duration-200 ease-in ${isHeaderTypeActive ? "max-h-2000 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
                    {isFulfilled ?
                        <TodoDeleteAllFulfilledButton />
                        :
                        <CollapseButton />
                    }
                </div>

            </div>

            <div className={`w-6/10 ml-auto mr-auto transition-all duration-400 origin-top ${isHeaderTypeActive ? "max-h-1000 scale-y-100" : "max-h-0 overflow-hidden scale-y-0"}`}>
                <TodoListDisplay displayFulfilled={isFulfilled ? true : false} />
            </div>
        </div>
    )
}

export default TodoListAndHeader;