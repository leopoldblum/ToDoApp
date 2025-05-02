import React, { useState, useEffect, createContext, useRef } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { isEqual } from 'lodash';
import { useFetchTodos, useMutationAddTodo, useMutationDeleteTodo, useMutationEditTodo } from './api/queriesAndMutations';

/**
 * @param {} content
 *  todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders() 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    const [blockTodosHistory, setBlockTodosHistory] = useState(false)

    const blockHistory = useRef(false)

    const [previousTodosHistory, setPreviousTodosHistory] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])

    const { isError, data: todosFromFetch, error } = useFetchTodos();

    const mutateAdd = useMutationAddTodo();
    const mutateDelete = useMutationDeleteTodo();
    const mutationEditTodo = useMutationEditTodo();


    if (isError) {
        console.error("error while fetching: " + error.message)
    }

    useEffect(() => {
        // console.log("todosFromFetch changed:", todosFromFetch);
        if (todosFromFetch) {
            const oldTodos = [...todos]; // Erstelle eine echte Kopie

            if (!todosFromFetch.some((element) => element.id === null)) {
                if (!blockHistory.current) {
                    setPreviousTodosHistory(prevHistory => [...prevHistory, oldTodos]);
                }
            }
            else {
                console.log("found placeholder")
            }

            setTodos(todosFromFetch);
        }
        // eslint-disable-next-line
    }, [todosFromFetch]);


    function displayPrevTodos() {
        console.log("prevtodos.length: " + previousTodosHistory.length)
        previousTodosHistory.forEach((el, index) => {
            console.log(`History[${index}]:`, JSON.stringify(el))
        })
        console.log("Current todos:", JSON.stringify(todos))
    }

    function removeNFomHistory(n) {
        setPreviousTodosHistory(prev => {
            if (prev.length < n) return [];
            return prev.slice(0, -n);
        });
    }

    async function undoLastAction() {

        // locking history, so that any changes made while undoing wont get added to it
        // setBlockTodosHistory(true);
        blockHistory.current = true

        try {
            if (previousTodosHistory.length <= 0) {
                console.error("No more states to undo left.");
                return;
            }

            const lastTodos = previousTodosHistory[previousTodosHistory.length - 1];

            const todosToAdd = lastTodos.filter(prevTodo => !todos.some(currTodo => currTodo.id === prevTodo.id));
            const todosToRemove = todos.filter(currTodo => !lastTodos.some(prevTodo => prevTodo.id === currTodo.id));
            const modifiedTodos = lastTodos.filter(prevTodo => {
                const currTodo = todos.find(t => t.id === prevTodo.id);
                return currTodo && !isEqual(prevTodo, currTodo);
            });

            removeNFomHistory(1);

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
            // setBlockTodosHistory(false);
            blockHistory.current = false
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos }}>

            <div>
                <button onClick={displayPrevTodos}> Debug History </button>

                <br />
                <br />

                {previousTodosHistory.length > 1 &&
                    <button onClick={() => undoLastAction()}> Undo Last Action </button>
                }

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