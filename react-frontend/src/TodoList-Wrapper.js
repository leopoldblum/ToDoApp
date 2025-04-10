import React, { useState, useEffect, createContext } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useQuery } from '@tanstack/react-query'

/**
 * @param {} content
 *  todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders(), updateList() 
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
    const { isError, data: todosFromFetch, error, refetch: updateList } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchAllTodos,
    })

    if (isError) {
        console.error("error while fetching: " + error.message)
    }

    useEffect(() => {
        if (todosFromFetch) {
            setTodos(todosFromFetch);
        }
    }, [todosFromFetch]);




    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos, updateList }}>

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
        - warum brauch onMutate ein return statement?
*/