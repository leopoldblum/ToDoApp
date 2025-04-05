import React, { useState, useEffect, createContext } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useQuery } from '@tanstack/react-query'

/**
 * @param {} content
 * descActiveTodos[],  todos[],  activeHeaders[],  toggleHeaderState(),  setDescActiveTodos(),  toggleDesc(),  updateList() 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])


    const fetchAllTodos = async () => {
        try {

            const response = await fetch("http://localhost:8080/todos")
            const allEntries = await response.json();

            return allEntries;
        }
        catch (error) {
            console.error("recv error:", error);
        }
    }

    // query for fetching todos from server
    const { isPending, isError, data: todosFromFetch, error, refetch: updateList } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchAllTodos,
    })


    if (isPending) {
        console.log("pending")
    }

    if (isError) {
        console.error("error while fetching: " + error.message)
    }

    useEffect(() => {
        if (todosFromFetch) {
            setTodos(todosFromFetch);
        }
    }, [todosFromFetch]);



    // toggle and helper functions
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

    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setDescActiveTodos, toggleHeaderState, toggleDesc, updateList }}>

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

    tanstackQuery:
        - muss die queryfn selbst die errors catchen, oder wird das beim aufruf der funktion gemacht?
        - refetch vs query in eigene funktion packen
*/