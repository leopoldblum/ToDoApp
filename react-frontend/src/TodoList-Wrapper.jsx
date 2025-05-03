import React, { useState, useEffect, createContext } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { useFetchTodos, useMutationAddTodo, useMutationDeleteTodo, useMutationEditTodo } from './api/queriesAndMutations';

/**
 * @param {} content
 *  todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders() 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])

    const { isError, data: todosFromFetch, error } = useFetchTodos();

    // const mutateAdd = useMutationAddTodo();
    // const mutateDelete = useMutationDeleteTodo();
    // const mutationEditTodo = useMutationEditTodo();


    if (isError) {
        console.error("error while fetching: " + error.message)
    }

    useEffect(() => {
        console.log("todosFromFetch changed:", todosFromFetch);

        if (todosFromFetch) {
            setTodos(todosFromFetch)
        }

        // eslint-disable-next-line
    }, [todosFromFetch]);

    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos }}>

            <div>

                <TodoEditOrAddButton isEdit={false} currentTodo={null} />

                {/* not cursed anymore :) */}
                <TodoListAndHeader isFulfilled={false} />
                <TodoListAndHeader isFulfilled={true} />

            </div>

        </todoListProvider.Provider >
    );
}

export default TodoListWrapper;