// import "./TodoCollapseAllButton.css"
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";
import BarsArrowDownIcon from "@heroicons/react/24/outline/BarsArrowDownIcon.js"
import BarsArrowUpIcon from "@heroicons/react/24/outline/BarsArrowUpIcon.js"

const CollapseButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

    const areAllDescCollapsed = (todoFuncAndData.descActiveTodos.length === 0)

    const toggleCollapseAllDesc = () => {
        if (todoFuncAndData.descActiveTodos.length !== 0) {
            // some desc are shown -> show no desc
            todoFuncAndData.setDescActiveTodos([]);
        }
        else {
            // no desc are shown -> show all descs
            const allTodoIDs = todoFuncAndData.todos.filter(entries => entries.fulfilled === false).map(todo => todo.id)
            todoFuncAndData.setDescActiveTodos(allTodoIDs);
        }
    }


    return (
        <div className="w-full h-full flex justify-center items-center ">

            <div className="pl-6 pr-6 pt-4 pb-4 rounded-md hover:cursor-pointer hover:text-red-400 transition duration-500 hover:scale-95"
                onClick={toggleCollapseAllDesc}>

                <div className="w-8 h-8 relative font-medium ">

                    <BarsArrowDownIcon className={` absolute inset-0 object-cover transition-all duration-500 ease-in-out ${areAllDescCollapsed ? "opacity-100" : "opacity-0 scale-85"}`} />
                    <BarsArrowUpIcon className={`absolute inset-0 object-cover transition-all duration-500 ease-in-out ${areAllDescCollapsed ? "opacity-0 scale-85" : "opacity-100"}`} />

                </div>


            </div>
        </div>

    );
};

export default CollapseButton;