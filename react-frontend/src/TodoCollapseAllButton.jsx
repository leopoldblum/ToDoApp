import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";
import BarsArrowDownIcon from "@heroicons/react/24/outline/BarsArrowDownIcon.js"
import BarsArrowUpIcon from "@heroicons/react/24/outline/BarsArrowUpIcon.js"

const CollapseButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

    // this is stupid
    const allActiveTodosWithActiveDesc = todoFuncAndData.descActiveTodos.filter(id =>
        todoFuncAndData.todos.some(todo => todo.id === id && todo.fulfilled === false
        ));

    const areAllDescCollapsed = (allActiveTodosWithActiveDesc.length === 0)

    const toggleCollapseAllDesc = () => {

        if (!areAllDescCollapsed) {
            // some desc are shown -> show no desc
            const allActiveTodosIDs = todoFuncAndData.todos.filter(entry => entry.fulfilled === false).map(todo => todo.id)
            todoFuncAndData.setDescActiveTodos(prev => prev.filter(id => !allActiveTodosIDs.includes(id)));
        }
        else {
            // no desc are shown -> show all descs
            const allTodoIDs = todoFuncAndData.todos.filter(entries => entries.fulfilled === false).map(todo => todo.id)
            todoFuncAndData.setDescActiveTodos(prev => [...prev, ...allTodoIDs]);
        }
    }

    return (
        <div className="flex justify-center items-center ">

            <button className="p-4 rounded-md cursor-pointer hover:text-text-hover-lm transition-all duration-300 hover:scale-95"
                onClick={toggleCollapseAllDesc}>

                <div className="w-6 h-6 md:w-8 md:h-8 relative font-medium">

                    <BarsArrowDownIcon className={`absolute inset-0 object-cover transition-all duration-300 ease-in-out ${areAllDescCollapsed ? "opacity-100" : "opacity-0 scale-85"}`} />
                    <BarsArrowUpIcon className={`absolute inset-0 object-cover transition-all duration-300 ease-in-out ${areAllDescCollapsed ? "opacity-0 scale-85" : "opacity-100"}`} />

                </div>


            </button>
        </div>

    );
};

export default CollapseButton;