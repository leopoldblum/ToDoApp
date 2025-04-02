import React, { useState, useEffect, createContext } from 'react';
import TodoList from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";


/**
 * @param {} content
 * descActiveTodos,  todos,  activeHeaders,  toggleHeaderState(),  toggleCollapseAllDesc(),  toggleDesc(),  updateList() 
 * 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])



    const updateList = async () => {
        try {

            const response = await fetch("http://localhost:8080/todos")
            const allEntries = await response.json();

            setTodos(allEntries);
        }
        catch (error) {
            console.error("recv error:", error);
        }
    }

    const toggleDesc = (id) => {
        setDescActiveTodos((currentActiveTodos) => {
            if (currentActiveTodos.includes(id)) {
                return currentActiveTodos.filter((activeID) => activeID !== id);
            }
            else {
                return [...currentActiveTodos, id];
            }
        });
    }


    /**
     * @param {string} header_type options: "header-active" "header-fulfilled" 
     * 
     * toggles given header_type in activeHeaders
     */

    const toggleHeaderState = (header_type) => {
        setActiveHeaders((currentActiveHeaders) => {
            if (currentActiveHeaders.includes(header_type)) {
                return currentActiveHeaders.filter((activeHeader) => activeHeader !== header_type);
            }
            else {
                return [...currentActiveHeaders, header_type];
            }
        })
    }

    const toggleCollapseAllDesc = () => {
        if (descActiveTodos.length !== 0) {
            // some desc are shown -> show no desc
            setDescActiveTodos([]);
        }
        else {
            // no desc are shown -> show all descs
            const allTodoIDs = todos.filter(entries => entries.fulfilled === false).map(todo => todo.id)
            setDescActiveTodos(allTodoIDs);
        }
    }


    useEffect(() => {
        updateList();
    }, []);

    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, toggleHeaderState, toggleCollapseAllDesc, toggleDesc, updateList }}>
            <div>

                <TodoEditOrAddButton isEdit={false} currentTodo={null} updateList={updateList} />

                {/* cursed */}
                <TodoList isFulfilled={false} descActiveTodos={descActiveTodos} todos={todos} activeHeaders={activeHeaders} toggleHeaderState={toggleHeaderState} toggleCollapseAllDesc={toggleCollapseAllDesc} toggleDesc={toggleDesc} updateList={updateList} />
                <TodoList isFulfilled={true} descActiveTodos={descActiveTodos} todos={todos} activeHeaders={activeHeaders} toggleHeaderState={toggleHeaderState} toggleCollapseAllDesc={toggleCollapseAllDesc} toggleDesc={toggleDesc} updateList={updateList} />

            </div>
        </todoListProvider.Provider>
    );
}


export default TodoListWrapper;


/*
    gibt es ne elegantere Lösung für updateList, damit die function nicht als prop weitergegeben werden muss?

        function foo(){} 
            vs 
        const foo = () => {}


    how to: smooth animationen bei dynamisch großen elementen (max-height > 100vh), wie bspw. todolist elemente

    best practice für responsive design?

    typescript prob goated

    welche seite für design, canva?

    onClick={() => funtion()} vs {function}

    bounded vs unbounded functions
*/