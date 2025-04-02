import "./TodoCollapseAllButton.css"
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const CollapseButton = () => {

    const todoFuncAndData = useContext(todoListProvider);


    return (
        <div className={`collapse-container`}>
            <button className="collapse-all-button" onClick={() => todoFuncAndData.toggleCollapseAllDesc()}> toggle desc</button>
        </div>
    );
};

export default CollapseButton;