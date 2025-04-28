import React, { useState, useEffect, createContext } from 'react';
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
        console.log("todosFromFetch changed:", todosFromFetch);
        if (todosFromFetch) {
            // console.log("fetched all todos: \n" + JSON.stringify(todosFromFetch));

            if (!todosFromFetch.some((element) => element.id === "placeholder")) {
                setPreviousTodosHistory(prevHistory => [...prevHistory, todos]);
                setTodos(todosFromFetch);
            }
            else {
                console.log("found placeholder")
            }

        }
        // eslint-disable-next-line
    }, [todosFromFetch]);


    function displayPrevTodos() {
        console.log("prev todos: " + JSON.stringify(previousTodosHistory.map(entry => entry)))
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
        var todosToAdd = lastTodos.filter(prevTodo => !todos.some(currTodo => currTodo.id === prevTodo.id));

        // delete added todo
        const todosToRemove = todos.filter(currTodo => !lastTodos.some(prevTodo => prevTodo.id === currTodo.id));

        // catch modified todos
        const modifiedTodos = lastTodos.filter(prevTodo => todos.some(currTodo => currTodo.id === prevTodo.id && !isEqual(prevTodo, currTodo)))

        // todosToRemove also end up in toAdd, because of cache shenanigans, toAdd needs to be cleared
        // if (todosToRemove.length !== 0) todosToAdd = [];

        console.log("todosToAdd: \n" + JSON.stringify(todosToAdd))
        console.log("todosToRemove: \n" + JSON.stringify(todosToRemove))
        console.log("modifiedTodos: \n" + JSON.stringify(modifiedTodos))

        // add a todo again
        if (todosToAdd.length !== 0) {
            console.log("deleted " + todosToAdd.length + " todo(s), which have to be added again")
            todosToAdd.forEach((el) => {
                console.log("added" + JSON.stringify(el));
                // mutateAdd.mutate({
                //     title: el.title,
                //     desc: el.desc,
                //     fulfilled: el.fulfilled,
                // });

                // setPreviousTodosHistory(prev => prev.slice(0, -1))
            }
            )
        }

        // delete a todo again
        else if (todosToRemove.length !== 0) {
            console.log("added a todo, which has to be deleted now")
            console.log("todosToRemove: " + JSON.stringify(todosToRemove))

            todosToRemove.forEach((el) => {
                // mutateDelete.mutate(el.id);
                console.log("removed" + JSON.stringify(el));
                // setPreviousTodosHistory(prev => prev.slice(0, -1));
            })
        }

        // modify todos again
        else if (modifiedTodos.length !== 0) {
            console.log("modified a todo, which has to be unmodified now")
            console.log("modifiedTodos: " + JSON.stringify(modifiedTodos))

            modifiedTodos.forEach((el) => {
                console.log("edited: " + el.id + ", " + el.title + ", " + el.desc + ", " + el.fulfilled);

                mutationEditTodo.mutate({
                    inputId: el.id,
                    inputTitle: el.title,
                    inputDesc: el.desc,
                    inputFulfilled: el.fulfilled
                },
                    {
                        // without this the prevTodo gets deleted first instead of simply removing the inbetween step to make the undo possible 
                        onSuccess: () => setPreviousTodosHistory(prev => prev.slice(0, -1))
                    }
                );
            })
        }

        setPreviousTodosHistory(prev => prev.slice(0, -1));

    }

    // const mutateUndoLastAction = useMutation({
    //     mutationFn: undoLastAction
    // })


    return (
        <todoListProvider.Provider value={{ descActiveTodos, todos, activeHeaders, setActiveHeaders, setDescActiveTodos }}>

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