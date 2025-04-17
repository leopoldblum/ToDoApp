import React, { useState, useEffect, createContext } from 'react';
import TodoListAndHeader from './TodoListAndHeader';
import TodoEditOrAddButton from "./TodoEditOrAddButton";
import { isEqual } from 'lodash';
import { useFetchTodos } from './api/queriesAndMutations';

/**
 * @param {} content
 *  todos[], descActiveTodos[], activeHeaders[] --- setDescActiveTodos(), setActiveHeaders(), updateList() 
 */
export const todoListProvider = createContext(null);


const TodoListWrapper = () => {

    // alle todos
    const [todos, setTodos] = useState([])

    const [previousTodosHistory, setPreviousTodosHistory] = useState([])

    // todos mit offener desc
    const [descActiveTodos, setDescActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])

    const { isError, data: todosFromFetch, error, refetch: updateList } = useFetchTodos();

    if (isError) {
        console.error("error while fetching: " + error.message)
    }

    useEffect(() => {
        console.log("todosFromFetch changed:", todosFromFetch);
        if (todosFromFetch) {
            console.log("fetched all todos");
            setPreviousTodosHistory(prevHistory => [...prevHistory, todos]); // ← Nutzt den aktuellen State
            setTodos(todosFromFetch);
        }
        // eslint-disable-next-line
    }, [todosFromFetch]);

    function displayPrevTodos() {
        console.log("prev todos: ")
        console.log(previousTodosHistory.map(entry => entry))
    }


    /** 
     * @todo doesnt work properly yet
     *  there can be more than one todo to undo, e.g. when deleting all fulfilled todos...
     */

    async function undoLastAction() {

        // inits with an empty array
        if (previousTodosHistory.length <= 1) {
            console.error("No more states to undo left.")
            return;
        }

        // previous state of todos
        const lastTodos = previousTodosHistory[previousTodosHistory.length - 1];

        //add deleted todo 
        var todoToAdd = lastTodos.filter(prevTodo => !todos.some(currTodo => currTodo.id === prevTodo.id));

        // delete added todo
        const todoToRemove = todos.filter(currTodo => !lastTodos.some(prevTodo => prevTodo.id === currTodo.id));

        // catch modified todos
        const modifiedTodo = lastTodos.filter(prevTodo => todos.some(currTodo => currTodo.id === prevTodo.id && !isEqual(prevTodo, currTodo))
        )

        // todosToRemove also end up in toAdd, because of cache shenanigans, toAdd needs to be cleared
        if (todoToRemove.length !== 0) todoToAdd = [];

        if (todoToAdd.length !== 0) {
            console.log("deleted a todo, which has to be added again")
            console.log("todosToAdd: " + JSON.stringify(todoToAdd))

            return
        }
        if (todoToRemove.length !== 0) {
            console.log("added a todo, which has to be deleted now")
            console.log("todosToRemove: " + JSON.stringify(todoToRemove))

            return
        }
        if (modifiedTodo.length !== 0) {
            console.log("modified a todo, which has to be unmodified now")
            console.log("modifiedTodos: " + JSON.stringify(modifiedTodo))

            return
        }


        setPreviousTodosHistory(prev => prev.slice(0, -1))
    }

    // const mutateUndoLastAction = useMutation({
    //     mutationFn: undoLastAction
    // })


    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos, updateList }}>

            <div>
                <button onClick={displayPrevTodos}> debug display </button>

                <br />
                <br />

                {previousTodosHistory.length > 1 &&
                    <button onClick={undoLastAction}> undo button frfr </button>
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