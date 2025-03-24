import './TodoList.css'
import React, { useState, useEffect } from 'react';
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';

import TodoEditOrAddButton from "./TodoEditOrAddButton";


const TodoList = ({ isFulfilled }) => {

    const [todos, setTodos] = useState([])
    const [activeTodos, setActiveTodos] = useState([])

    // header die ausgeklappt sind => "header-actives", "header-fulfilled"
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])

    const headerType = isFulfilled ? "header-fulfilled" : "header-actives"

    const updateList = async () => {
        try {

            const response = await fetch("http://localhost:8080/todos")
            const allEntries = await response.json();

            setTodos(allEntries);
        }
        catch (error) {
            console.error("recv error:", error);
        }
    }

    const toggleDesc = (id) => {
        setActiveTodos((currentActiveTodos) => {
            if (currentActiveTodos.includes(id)) {
                return currentActiveTodos.filter((activeID) => activeID !== id);
            }
            else {
                return [...currentActiveTodos, id];
            }
        });
    }

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
        if (activeTodos.length !== 0) {
            // some desc are shown -> show no desc
            setActiveTodos([]);
        }
        else {
            // no desc are shown -> show all descs
            const allTodoIDs = todos.map(todo => todo.id)
            setActiveTodos(allTodoIDs);
        }
    }


    useEffect(() => {
        updateList();
    }, []);

    return (
        <div>

            {!isFulfilled && <TodoEditOrAddButton isEdit={false} currentTodo={null} updateList={updateList} />}

            <div className='section-todos-header' >

                <div className={`section-todos-header-icon  ${activeHeaders.includes(headerType) ? "active" : ""} `}>
                    &gt;
                </div>

                <div className='section-todos-header-title' onClick={() => toggleHeaderState(headerType)} >
                    {!isFulfilled && <h1> active todos </h1>}
                    {isFulfilled && <h1> fulfilled todos </h1>}

                </div>

                <div className={`header-button-container toggle-visibility-container ${activeHeaders.includes(headerType) ? "visible" : ""}`}>
                    {!isFulfilled && <CollapseButton toggleCollapseAllDesc={toggleCollapseAllDesc} />}
                    {isFulfilled && <TodoDeleteAllFulfilledButton updateList={updateList} activeHeaders={activeHeaders} />}
                </div>

            </div>

            <div className={`toggle-visibility-container ${activeHeaders.includes(headerType) ? "visible" : ""}`}>
                {!isFulfilled && <TodoListDisplay displayFulfilled={false} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} />}
                {isFulfilled && <TodoListDisplay displayFulfilled={true} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} />}
            </div>

        </div>
    );
}


export default TodoList;


/*
    gibt es ne elegantere Lösung für updateList, damit die function nicht als prop weitergegeben werden muss?

        function foo(){} 
            vs 
        const foo = () => {}


    es gibt keine css animationen bei display: none -> block, wie kann man das dann machen?
        -> warum ist das so wonky mit visibility, height usw.
        -> max_height: 0 -> max_height: 5000vh ist scuffed af, bessere möglichkeit dafür? 

    how to: smooth animationen bei dynamisch großen elementen (max-height > 100vh), wie bspw. todolist elemente
    => workaround mit scrollbar

    best practice für responsive design?
    => wie dynamic font size?

    typescript prob goated

    welche seite für design, canva?

    icon, header-state und collapse/delete-all button sind nicht coupled aneinander, wie würde man das am ehesten machen? useState für header und dann per props an elemente?
    -> done

    onClick={() => funtion()} vs {function}

    bounded vs unbounded functions
*/