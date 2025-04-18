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
        <div className={`collapse-container`}>
            <button className="collapse-all-button" onClick={() => toggleCollapseAllDesc()}> toggle desc</button>
        </div>
    );
};

export default CollapseButton;