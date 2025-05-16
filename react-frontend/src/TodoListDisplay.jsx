import TodoDeleteButton from "./TodoDeleteButton";
import TodoCustomCheckmark from "./TodoCustomCheckmark";
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useContext } from "react";
import { todoListProvider } from "./TodoList-Wrapper";

const TodoListDisplay = ({ displayFulfilled }) => {

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
        <div className="block m-auto overflow-hidden w-9/10">

            {todoFuncAndData.todos != null && todoFuncAndData.todos.filter(entries => entries.fulfilled === displayFulfilled).map((entries) => (

                // set height for todo entry here
                <div className={"flex flex-col justify-center items-center h-auto mt-5 mb-5 select-none border-l-2 border-accent-lm"} key={entries.id}>

                    {/* title */}
                    <div className="flex flex-row justify-center items-center min-h-20 w-full border-b-1 border-accent-lm">

                        <div className={`flex flex-2/3 items-center overflow-auto text-left  pl-10 pr-10 pt-5 pb-5 break-all cursor-pointer ${displayFulfilled ? "line-through text-text-linethrough" : ""}`}
                            onClick={() => toggleDesc(entries.id)}>
                            {entries.title}
                        </div>

                        <div className="flex flex-1/3 justify-center items-center text-accent-lm">

                            <div className="flex flex-1/3 justify-center items-center ">
                                <TodoEditOrAddButton currentTodo={entries} />
                            </div>

                            <div className="flex flex-1/3 justify-center items-center">
                                <TodoDeleteButton currentTodo={entries} />
                            </div>

                            <div className="flex flex-1/3 justify-center items-center">
                                <TodoCustomCheckmark currentTodo={entries} checked={displayFulfilled} />
                            </div>

                        </div>

                    </div>

                    <div
                        className={` overflow-hidden transition-[max-height] duration-400 ease-in-out w-full ${todoFuncAndData.descActiveTodos.includes(entries.id)
                            ? "max-h-200"
                            : "max-h-0"}`}
                    >

                        <div className="flex items-center pt-5 pb-5 pl-10 pr-10 w-full h-full min-h-20">

                            <div className="text-left break-all w-full font-medium">
                                {entries.desc}
                            </div>

                        </div>

                    </div>

                </div>
            ))
            }
        </div >
    )

}


export default TodoListDisplay;