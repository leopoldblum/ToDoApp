import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";
import { AnimatePresence, motion } from "motion/react"

const TodoListEntry = ({ displayFulfilled, currentTodo }) => {

    const todoFuncAndData = useContext(todoListProvider);

    const toggleDesc = (id) => {
        todoFuncAndData.setDescActiveTodos((currentDescActiveTodos) => {
            if (currentDescActiveTodos.includes(id)) {
                return currentDescActiveTodos.filter((activeID) => activeID !== id);
            }
            else {
                return [...currentDescActiveTodos, id];
            }
        });
    }

    return (

        // set height for todo entry here
        <div className={"flex flex-col justify-center items-center h-auto mt-5 mb-5 select-none border-l-2 border-accent-lm"} >

            {/* title */}
            <div className="flex flex-row justify-center items-center min-h-15 lg:min-h-20 w-full border-b-1 border-accent-lm">

                <div className={`flex flex-2/3 items-center overflow-auto text-left pl-3 pr-3 lg:pl-10 lg:pr-10 pt-5 pb-5 break-all cursor-pointer ${displayFulfilled ? "line-through text-text-linethrough" : ""}`}
                    onClick={() => toggleDesc(currentTodo.id)}>
                    {currentTodo.title}
                </div>

                <div className="flex flex-1/3 gap-2 justify-center items-center text-accent-lm">

                    <div className="flex flex-1/3 justify-center items-center ">
                        <TodoEditOrAddButton currentTodo={currentTodo} />
                    </div>

                    <div className="flex flex-1/3 justify-center items-center">
                        <TodoDeleteButton currentTodo={currentTodo} />
                    </div>

                    <div className="flex flex-1/3 justify-center items-center">
                        <TodoCustomCheckmark currentTodo={currentTodo} checked={displayFulfilled} />
                    </div>

                </div>

            </div>

            <AnimatePresence>
                {todoFuncAndData.descActiveTodos.includes(currentTodo.id) &&
                    <motion.div
                        initial={{ opacity: 0, height: 0, scaleY: 0, originY: 0 }}
                        animate={{ opacity: 1, height: "auto", scaleY: 1, originY: 0 }}
                        exit={{ opacity: 0, height: 0, scaleY: 0, originY: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: "100%", overflow: "hidden" }}
                    >

                        <div className="flex items-center justify-start pt-3 pb-3 pl-3 pr-3 lg:pl-10 lg:pr-10 min-h-15 lg:min-h-20 overflow-y-hidden text-left break-all font-medium text-accent-lm">

                            {currentTodo.desc}

                        </div>

                    </motion.div>
                }
            </AnimatePresence>

        </div >
    )

}


export default TodoListEntry;