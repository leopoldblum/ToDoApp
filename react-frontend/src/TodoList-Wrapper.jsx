import React, { useState, useEffect, createContext } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { isEqual } from "lodash"
import { useFetchTodos, useMutationAddTodo, useMutationDeleteTodo, useMutationEditTodo } from './api/queriesAndMutations';

/**
 * @param {} content
 *  todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders() 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    const [todoHistory, setTodoHistory] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])

    const { isError, data: todosFromFetch, error } = useFetchTodos();

    if (isError) {
        console.error("error while fetching: " + error.message)
    }


    // const mutateAdd = useMutationAddTodo();
    // const mutateDelete = useMutationDeleteTodo();
    // const mutationEditTodo = useMutationEditTodo();

    const showHistory = () => {
        todoHistory.forEach((el, index) => console.log("history[" + index + "]: " + JSON.stringify(el)))
    }

    const updateTodos = () => {

        if (todosFromFetch) {

            if (todos.some((el) => el.id === null)) {
                console.log("added a placeholder, skipping add to history")
            }
            else {
                // if(blockHistory === false)...
                console.log("setting history")
                setTodoHistory(prev => [...prev, [...todos]])
            }

            if (todosFromFetch === null) {
                console.log("fetched is null")
            }

            if (isEqual(todosFromFetch, [])) {
                console.log("fetches is []")
            }

            setTodos([...todosFromFetch])

        }
    }

    useEffect(() => {
        console.log("todosFromFetch changed:", todosFromFetch);

        updateTodos();

        // eslint-disable-next-line
    }, [todosFromFetch]);

    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos }}>

            <div>

                <button onClick={showHistory} style={{ padding: 50 }}>  debug history </button>

                <br />
                <br />

                <TodoEditOrAddButton isEdit={false} currentTodo={null} />

                {/* not cursed anymore :) */}
                <TodoListAndHeader isFulfilled={false} />
                <TodoListAndHeader isFulfilled={true} />

            </div>

        </todoListProvider.Provider >
    );
}

export default TodoListWrapper;