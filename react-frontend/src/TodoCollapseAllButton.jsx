import "./TodoCollapseAllButton.css"
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const CollapseButton = () => {

    const todoFuncAndData = useContext(todoListProvider);

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
        <div className="w-full bg-amber-200">
            <button
                className="w-3/4 bg-amber-800 text-amber-50 font-medium pl-4 pr-4 pt-3 pb-3 border-0 rounded-md hover:bg-emerald-300 hover:cursor-pointer transition duration-500 hover:scale-105"
                onClick={() => toggleCollapseAllDesc()}>
                toggle desc
            </button>
        </div>
    );
};

export default CollapseButton;