import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListEntry from './TodoListEntry';
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";
import { AnimatePresence, motion } from "motion/react"

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
            <motion.div className='h-15 lg:h-20 w-19/20 lg:w-8/10 ml-auto mr-auto mt-8 flex items-center justify-evenly border-accent-lm border-b-2 border-l-2 rounded-bl-xs'
                layout
                transition={{ duration: 0.3 }}
            >

                <div className={` p-4 lg:p-5 flex text-xl justify-center items-center pointer-events-auto select-none transition-all duration-200 ease-in ${isHeaderTypeActive ? "rotate-90" : ""} `}>
                    &gt;
                </div>

                <div className='h-full w-8/10 grow text-left flex items-center select-none cursor-pointer' onClick={() => toggleHeaderState(headerType)} >

                    <h1> {isFulfilled ? "fulfilled todos" : "active todos"}  ({specificTodoCounter}) </h1>

                </div>

                <div className={`flex justify-center grow-0 items-center text-accent-lm transition-all duration-300 ease-in ${isHeaderTypeActive ? "max-h-2000 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
                    {isFulfilled ?
                        <TodoDeleteAllFulfilledButton />
                        :
                        <CollapseButton />
                    }
                </div>

            </motion.div>

            <AnimatePresence>

                {isHeaderTypeActive &&
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0, scaleY: 0, originY: 0 }}
                        animate={{ opacity: 1, height: "auto", scaleY: 1, originY: 0 }}
                        exit={{ opacity: 0, height: 0, scaleY: 0, originY: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={`w-22/25 lg:w-18/25 m-auto block`}>


                            {todoFuncAndData.todos != null && todoFuncAndData.todos.filter(entry => entry.fulfilled === isFulfilled).map(entry =>
                                // for transition when moving todos between headers

                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    key={entry.id}
                                >
                                    <TodoListEntry displayFulfilled={isFulfilled} currentTodo={entry} />

                                </motion.div>

                            )}

                        </div>

                    </motion.div >

                }

            </AnimatePresence >

        </div >
    )
}

export default TodoListAndHeader;