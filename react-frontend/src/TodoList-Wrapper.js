import React, { useState, useEffect, createContext } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useQuery } from '@tanstack/react-query'


/**
 * @param {} content
 * descActiveTodos[],  todos[],  activeHeaders[],  toggleHeaderState(),  toggleCollapseAllDesc(),  toggleDesc(),  updateList() 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])


    const fetchTodos = async () => {
        try {

            const response = await fetch("http://localhost:8080/todos")
            const allEntries = await response.json();

            return allEntries;
        }
        catch (error) {
            console.error("recv error:", error);
        }
    }

    const { isPending, isError, data: todosFromFetch, error, refetch: updateList } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    })


    if (isPending) {
        console.log("pending")
    }

    if (isError) {
        console.error("error while fetching: " + error.message)
    }

    useEffect(() => {
        if (todosFromFetch) {
            setTodos(todosFromFetch); // 🔄 Update des lokalen States
        }
    }, [todosFromFetch]);

    const toggleDesc = (id) => {
        setDescActiveTodos((currentDescActiveTodos) => {
            if (currentDescActiveTodos.includes(id)) {
                return currentDescActiveTodos.filter((activeID) => activeID !== id);
            }
            else {
                return [...currentDescActiveTodos, id];
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

    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, toggleHeaderState, toggleCollapseAllDesc, toggleDesc, updateList }}>

            <div>

                <TodoEditOrAddButton isEdit={false} currentTodo={null} />

                {/* not cursed anymore :) */}
                <TodoListAndHeader isFulfilled={false} />
                <TodoListAndHeader isFulfilled={true} />

            </div>

        </todoListProvider.Provider>

    );
}


export default TodoListWrapper;


/*
    gibt es ne elegantere Lösung für updateList, damit die function nicht als prop weitergegeben werden muss?
    => useContext is epic

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