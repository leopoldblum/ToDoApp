import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListEntry from './TodoListEntry';
import { useContext, useRef, useState, useEffect } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoListAndHeader = ({ isFulfilled }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"
    const isHeaderTypeActive = todoFuncAndData.activeHeaders.includes(headerType)
    const specificTodoCounter = todoFuncAndData.todos.filter(entries => entries.fulfilled === isFulfilled).length

    const todoListHeightRef = useRef(null)
    const [todoListHeight, setTodoListHeight] = useState("0px")

    useEffect(() => {
        const observedElement = todoListHeightRef.current;
        if (!observedElement) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Always measure the height regardless of active state
                const newHeight = entry.contentRect.height + 20;
                setTodoListHeight(newHeight + "px");
            }
        });

        resizeObserver.observe(observedElement);
        return () => {
            resizeObserver.disconnect();
        };
    }, [todoFuncAndData.todos]); // Remove isHeaderTypeActive from dependencies

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
            <div className='h-20 w-8/10 ml-auto mr-auto mt-8 flex items-center justify-center border-accent-lm border-b-2 border-l-2 rounded-bl-xs'>

                <div className={`flex-1/15  h-3/4 flex text-2xl justify-center items-center pointer-events-auto select-none transition-all duration-200 ease-in ${isHeaderTypeActive ? "rotate-90" : ""} `}>
                    &gt;
                </div>

                <div className='flex-11/15  h-3/4 text-left flex items-center select-none cursor-pointer' onClick={() => toggleHeaderState(headerType)} >

                    <h1> {isFulfilled ? "fulfilled todos" : "active todos"}  ({specificTodoCounter}) </h1>

                </div>

                <div className={` flex-3/15 h-3/4 flex justify-center items-center text-accent-lm transition-all duration-300 ease-in ${isHeaderTypeActive ? "max-h-2000 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
                    {isFulfilled ?
                        <TodoDeleteAllFulfilledButton />
                        :
                        <CollapseButton />
                    }
                </div>

            </div>

            <div
                className={`w-8/10 ml-auto mr-auto transition-all duration-300 mb-10 ease-in overflow-hidden`}
                style={{ height: isHeaderTypeActive ? todoListHeight : "0px" }}
            >

                <div className="m-auto  w-9/10"
                    ref={todoListHeightRef}
                // style={{ opacity: isHeaderTypeActive ? '1' : '0' }}
                >

                    {todoFuncAndData.todos != null && todoFuncAndData.todos.filter(entry => entry.fulfilled === isFulfilled).map(entry =>

                        <TodoListEntry displayFulfilled={isFulfilled ? true : false} currentTodo={entry} key={entry.id} />

                    )}
                </div>
            </div>
        </div>
    )
}

export default TodoListAndHeader;