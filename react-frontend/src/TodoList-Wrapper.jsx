import React, { useState, useEffect, createContext, useRef } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { isEqual } from "lodash";
import { useFetchTodos, useMutationAddTodo, useMutationDeleteTodo, useMutationEditTodo } from './api/queriesAndMutations';

/**
 * @param {} content 
 * todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders()
 */
export const todoListProvider = createContext(null);

const TodoListWrapper = () => {
    // alle todos
    const [todos, setTodos] = useState([]);
    const [todoHistory, setTodoHistory] = useState([]);
    const isHistoryBlockedRef = useRef(false);

    const initialLoadDoneRef = useRef(false);

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([]);
    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"]);

    const { isError, data: todosFromFetch, error } = useFetchTodos();

    if (isError) {
        console.error("error while fetching: " + error.message);
    }

    const mutateAdd = useMutationAddTodo();
    const mutateDelete = useMutationDeleteTodo();
    const mutationEditTodo = useMutationEditTodo();

    const showHistory = () => {
        todoHistory.forEach((el, index) => console.log("history[" + index + "]: " + JSON.stringify(el)));
    };

    const updateTodosAndManageHistory = () => {
        if (todosFromFetch) {
            // Check if this is an actual update (not initial load)
            if (initialLoadDoneRef.current) {
                if ((todos.some((el) => el.id === null)) === false) {

                    // only write in history when it's supposed to, not when undoing things
                    if (isHistoryBlockedRef.current === false) {
                        console.log("setting history");
                        setTodoHistory(prev => [...prev, [...todos]]);
                    }
                    else {
                        // console.log("undoing..., not setting history");
                    }
                }
                else {
                    // console.log("added a placeholder, skipping add to history");
                }
            } else {
                // console.log("Initial loaded, skipping history entry");   
                initialLoadDoneRef.current = true;
            }

            setTodos([...todosFromFetch]);
        }
    };

    useEffect(() => {
        // console.log("todosFromFetch changed:", todosFromFetch);
        updateTodosAndManageHistory();
        // eslint-disable-next-line
    }, [todosFromFetch]);


    async function undoLastAction() {

        // locking history, so that any changes made while undoing wont get added to it
        isHistoryBlockedRef.current = true;

        try {
            if (todoHistory.length <= 0) {
                console.error("No more states to undo left.");
                return;
            }

            const lastTodos = todoHistory[todoHistory.length - 1];

            const todosToAdd = lastTodos.filter(prevTodo => !todos.some(currTodo => currTodo.id === prevTodo.id));
            const todosToRemove = todos.filter(currTodo => !lastTodos.some(prevTodo => prevTodo.id === currTodo.id));
            const modifiedTodos = lastTodos.filter(prevTodo => {
                const currTodo = todos.find(t => t.id === prevTodo.id);
                return currTodo && !isEqual(prevTodo, currTodo);
            });

            setTodoHistory(prev => prev.slice(0, -1))

            if (todosToAdd.length !== 0) {
                //re-adding all todos, slightly bugged 

                for (const todoA of todosToAdd) {
                    await mutateAdd.mutateAsync({
                        id: todoA.id,
                        title: todoA.title,
                        desc: todoA.desc,
                        fulfilled: todoA.fulfilled,
                    })
                }

            } else if (todosToRemove.length !== 0) {
                // re-deleting all todos

                for (const todoD of todosToRemove) {
                    await mutateDelete.mutateAsync(todoD.id)
                }

            } else if (modifiedTodos.length !== 0) {
                // re-modifying all todos

                for (const todoM of modifiedTodos) {
                    await mutationEditTodo.mutateAsync({
                        inputId: todoM.id,
                        inputTitle: todoM.title,
                        inputDesc: todoM.desc,
                        inputFulfilled: todoM.fulfilled,
                    })
                }
            }

        } catch (error) {
            console.error("Undo failed:", error);

        } finally {
            // unlocking history
            isHistoryBlockedRef.current = false;
        }
    }


    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos }}>

            <div>

                <button onClick={showHistory} style={{ padding: 50 }}>  debug history </button>

                <br />
                <br />
                {todoHistory.length > 0 &&
                    <button onClick={undoLastAction} style={{ padding: 50, backgroundColor: 'lightgreen' }}>  placeholder undo </button>}

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