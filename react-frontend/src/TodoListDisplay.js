import "./TodoListDisplay.css"
import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoListDisplay = ({ displayFulfilled }) => {

    const todoFuncAndData = useContext(todoListProvider);


    return (
        <div className="all-todos-container">
            {todoFuncAndData.todos != null && todoFuncAndData.todos.filter(entries => entries.fulfilled === displayFulfilled).map((entries) => (

                <div className={`todoEntry-container ${displayFulfilled ? "todoEntryCompleted-container" : ""}`} key={entries.id}>

                    <div className={`todoEntry-box todo-title ${displayFulfilled ? "todo-title-linethrough" : ""}`} onClick={() => todoFuncAndData.toggleDesc(entries.id)}>
                        {entries.title}
                    </div>

                    <div className="todoEntry-box">
                        <div className="todoEntry-box-placeholder-container">
                            <TodoEditOrAddButton currentTodo={entries} />
                        </div>

                        <div className="todoEntry-box-placeholder-container">
                            <TodoDeleteButton currentTodo={entries} />
                        </div>

                        <div className="todoEntry-box-placeholder-container checkbox">
                            <TodoCustomCheckmark currentTodo={entries} checked={displayFulfilled} />
                        </div>

                    </div>

                    <div className={`todoEntry-desc-popup ${todoFuncAndData.descActiveTodos.includes(entries.id) ? "visible" : "hidden"}`}>
                        <div className="todoEntry-desc-text">{entries.desc}</div>
                    </div>

                </div>
            ))
            }
        </div>
    )

}


export default TodoListDisplay;