import React, { useState, useEffect } from 'react';
import './TodoList.css'
import TodoAddButton from './TodoAddButton';
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';

const TodoList = () => {

    const [todos, setTodos] = useState([])
    const [activeTodos, setActiveTodos] = useState([])
    const [activeHeaders, setActiveHeaders] = useState(["header-actives"])

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

    const toggleHeaderState = (headerID) => {
        setActiveHeaders((currentActiveHeaders) => {
            if (currentActiveHeaders.includes(headerID)) {
                // remove active Header from state
                return currentActiveHeaders.filter((activeHeader) => activeHeader !== headerID);
            }
            else {
                // add active Header to state
                return [...currentActiveHeaders, headerID];
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

    const toggleVisibilityOfTodoLists = (elemIDtoToggle, headerID) => {
        const toggleVisibilityElem = document.getElementById(elemIDtoToggle);
        const headerTypeID = document.getElementById(headerID);

        toggleVisibilityElem.classList.toggle("visible");

        if (toggleVisibilityElem.classList.contains("visible")) {
            toggleVisibilityElem.addEventListener("transitionend", () => headerTypeID.scrollIntoView({ behavior: "smooth", block: "start" }), { once: true });
        }
        else {
            headerTypeID.scrollIntoView({ behavior: "smooth", block: "center" })
            toggleVisibilityElem.addEventListener("transitionend", () => headerTypeID.scrollIntoView({ behavior: "smooth", block: "center" }), { once: true });
        }

        toggleHeaderState(headerID);
    }

    useEffect(() => {
        updateList();
    }, []);

    return (
        <div>

            {/* render add todo button form */}
            <TodoAddButton funcUpdateList={updateList} />

            {/* Active Todos */}
            <div className='section-todos-header' >
                <div className={`section-todos-header-icon  ${activeHeaders.includes("header-actives") ? "active" : ""} `} id="section-todos-header-icon-actives">
                    &gt;
                </div>

                <div className='section-todos-header-title' id="header-actives" onClick={() => toggleVisibilityOfTodoLists("all-active-todos-container", "header-actives")}>
                    <h1> active todos </h1>
                </div>

                <div className='header-button-container'>
                    <CollapseButton toggleCollapseAllDesc={toggleCollapseAllDesc} activeHeaders={activeHeaders} />
                </div>
            </div>

            <TodoListDisplay displayFulfilled={false} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} activeHeaders={activeHeaders} />

            {/* completed todos */}
            <div className='section-todos-header' >
                <div className={`section-todos-header-icon  ${activeHeaders.includes("header-fulfilled") ? "active" : ""} `} id="section-todos-header-icon-completed">
                    &gt;
                </div>

                <div className='section-todos-header-title' id="header-fulfilled" onClick={() => toggleVisibilityOfTodoLists("all-fulfilled-todos-container", "header-fulfilled")}>
                    <h1> completed todos </h1>
                </div>

                <div className='header-button-container'>
                    <TodoDeleteAllFulfilledButton updateList={updateList} activeHeaders={activeHeaders} />
                </div>

            </div>

            {/* render fulfilled todos list */}
            <TodoListDisplay displayFulfilled={true} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} activeHeaders={activeHeaders} />

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

    how to: animationen bei dynamisch großen elementen (max-height > 100vh), wie bspw. todolist elemente

    wie mach man gutes responsive design, sodass das nach verschieben nicht ass aussieht?

    typescript prob goated

    welche seite für design, canva?

    icon, header-state und collapse/delete-all button sind nicht coupled aneinander, wie würde man das am ehesten machen? useState für header und dann per props an elemente?
*/