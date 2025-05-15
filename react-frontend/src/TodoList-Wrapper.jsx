import React, { useState, useEffect, createContext, useRef } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { isEqual } from "lodash";
import { useFetchTodos, useMutationAddTodo, useMutationDeleteTodo, useMutationEditTodo } from './api/queriesAndMutations';


/**
 * @param {} content
 * userIDref, todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders()
 */
export const todoListProvider = createContext(null);

const TodoListWrapper = () => {

    // saves userID
    const userIDref = useRef(localStorage.getItem("userID"));

    // all todos - remove use todoFromFetch
    const [todos, setTodos] = useState([]);

    // history
    const [todoHistory, setTodoHistory] = useState([]);

    // for blocking when undoing
    const isHistoryBlockedRef = useRef(false);

    // skipping first setHistory
    const initialLoadDoneRef = useRef(false);

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([]);

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"]);

    const { isError, data: todosFromFetch, error } = useFetchTodos(userIDref.current);

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

        // check if it is a valid fetch, that contains data
        if (todosFromFetch) {

            // check whether this is an actual update (not initial load)
            if (initialLoadDoneRef.current) {

                // check that it doesnt contain optmistic update data
                if (!(todos.some((el) => el.id.toString().startsWith("placeholder_")))) {

                    // only write in history when it's supposed to, not when undoing things
                    if (isHistoryBlockedRef.current === false) {

                        // console.log("setting history");
                        setTodoHistory(prev => [...prev, [...todos]]);
                    }
                    // else: undos things, therefore should not add to history
                }
                // else: fetched an optmistic update which should not be in the history
            } else {
                // is a first load: skip, cuz we dont have sth to put in the history atp

                // console.log("Initial loaded, skipping history entry");
                initialLoadDoneRef.current = true;
            }

            setTodos([...todosFromFetch]);
        }
        else if (todosFromFetch === null) {
            // edge case when there are no todos in DB when mounting, has to update initialLoadState here as well

            if (!initialLoadDoneRef.current) {
                initialLoadDoneRef.current = true;
            }
        }
    };

    useEffect(() => {
        // console.log("todosFromFetch changed:", todosFromFetch);
        updateTodosAndManageHistory();

        // eslint-disable-next-line
    }, [todosFromFetch]);


    // handling userID on mount
    useEffect(() => {
        if (!userIDref.current) {
            const generateUserID = crypto.randomUUID()
            localStorage.setItem("userID", generateUserID)
            // console.log("userID set to UUID: " + generateUserID)
        }
        else {
            // console.log("userID is already set to: " + userIDref.current)
        }
    }, [])


    async function undoLastAction() {

        // locking history, so that any changes made while undoing wont get added to it
        isHistoryBlockedRef.current = true;

        try {
            if (todoHistory.length <= 0) {
                console.error("No more states to undo left.");
                return;
            }

            // last state of todos
            const lastTodos = todoHistory[todoHistory.length - 1];

            // calc differences between current state and last state
            const todosToAdd = lastTodos.filter(prevTodo => !todos.some(currTodo => currTodo.id === prevTodo.id));
            const todosToRemove = todos.filter(currTodo => !lastTodos.some(prevTodo => prevTodo.id === currTodo.id));
            const modifiedTodos = lastTodos.filter(prevTodo => {
                const currTodo = todos.find(t => t.id === prevTodo.id);
                return currTodo && !isEqual(prevTodo, currTodo);
            });

            // remove last state from history
            setTodoHistory(prev => prev.slice(0, -1))

            if (todosToAdd.length !== 0) {
                // re-adding all deleted todos

                for (const todoA of todosToAdd) {
                    await mutateAdd.mutateAsync({
                        id: todoA.id,
                        title: todoA.title,
                        desc: todoA.desc,
                        fulfilled: todoA.fulfilled,
                        userid: todoA.userid,
                    })
                }

                return
            }

            if (todosToRemove.length !== 0) {
                // re-deleting all todos

                for (const todoD of todosToRemove) {
                    await mutateDelete.mutateAsync({
                        todoID: todoD.id,
                        userid: todoD.userid,
                    })
                }

                return
            }

            if (modifiedTodos.length !== 0) {
                // re-modifying all todos

                for (const todoM of modifiedTodos) {
                    await mutationEditTodo.mutateAsync({
                        id: todoM.id,
                        title: todoM.title,
                        desc: todoM.desc,
                        fulfilled: todoM.fulfilled,
                        userid: todoM.userid,
                    })
                }

                return
            }

        } catch (error) {
            // sth went wrong
            console.error("Undo failed:", error);

        } finally {
            // done with undoing, unlocking history
            isHistoryBlockedRef.current = false;
        }
    }


    return (
        <todoListProvider.Provider value={{ userIDref, descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos }}>

            <div>

                {/* <button onClick={showHistory} style={{ padding: 50 }}>  debug history </button> */}

                {/* <br />
                <br />
                {todoHistory.length > 0 &&
                    <button onClick={undoLastAction} style={{ padding: 50, backgroundColor: 'lightgreen' }}>  placeholder undo </button>}

                <br />
                <br /> */}

                <TodoEditOrAddButton isEdit={false} currentTodo={null} />

                {/* not cursed anymore :) */}
                <TodoListAndHeader isFulfilled={false} />
                <TodoListAndHeader isFulfilled={true} />

            </div>

        </todoListProvider.Provider >
    );
}

export default TodoListWrapper;