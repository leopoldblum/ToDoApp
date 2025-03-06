import React, { useState, useEffect } from 'react';
import './TodoList.css'
import TodoAddButton from './TodoAddButton';
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';
import CollapseButton from './TodoCollapseAllButton';
import TodoListDisplay from './TodoListDisplay';

const TodoList = () => {

    const [todos, setTodos] = useState([])
    const [activeTodos, setActiveTodos] = useState([])

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
                return activeTodos.filter((activeID) => activeID !== id);
            }
            else {
                return [...currentActiveTodos, id];
            }
        });
    }

    const toggleCollapseAllActiveDesc = () => {
        if (activeTodos.length !== 0) {
            setActiveTodos([]);
        }
        else {
            // doesnt work
            const allTodoIDs = todos.map(todo => todo.id)
            setActiveTodos(allTodoIDs);
        }
    }

    const toggleVisibilityOfTodoLists = (elemIDtoToggle, headerID) => {
        const toggleVisibilityElem = document.getElementById(elemIDtoToggle);
        const headerTypeID = document.getElementById(headerID);

        if (toggleVisibilityElem.classList.contains("visible")) {
            if (elemIDtoToggle === "all-fulfilled-todos-container") {
                // header for fulfilled todos
                (document.getElementById("delete-fulfilled-todos-button")).classList.toggle("visible");
                (document.getElementById("section-todos-header-icon-completed")).classList.toggle("active");
            }
            else {
                //header for open todos
                document.getElementById("toggle-collapse-desc-button").classList.toggle("visible");
                (document.getElementById("section-todos-header-icon-actives")).classList.toggle("active");
            }

            toggleVisibilityElem.classList.remove("visible");
            toggleVisibilityElem.classList.add("hidden")
            headerTypeID.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        else {
            if (elemIDtoToggle === "all-fulfilled-todos-container") {
                //header for fulfilled todos
                (document.getElementById("delete-fulfilled-todos-button")).classList.toggle("visible");
                (document.getElementById("section-todos-header-icon-completed")).classList.toggle("active");
            }
            else {
                //header for open todos
                document.getElementById("toggle-collapse-desc-button").classList.toggle("visible");
                (document.getElementById("section-todos-header-icon-actives")).classList.toggle("active");
            }

            toggleVisibilityElem.classList.remove("hidden")
            toggleVisibilityElem.classList.add("visible")

            toggleVisibilityElem.addEventListener("transitionend", () => headerTypeID.scrollIntoView({ behavior: "smooth", block: "start" }), { once: true });
        }
    }

    useEffect(() => {
        updateList();
    }, []);


    return (
        <div id="todoList">


            {/* render add todo button form */}
            <TodoAddButton funcUpdateList={updateList} />


            {/* Active Todos */}
            <div className='section-todos-header'>
                <div className='section-todos-header-icon' id="section-todos-header-icon-actives">
                    &gt;
                </div>

                <div className='section-todos-header-title' id="header-actives" onClick={() => toggleVisibilityOfTodoLists("all-active-todos-container", "header-actives")}>
                    <h1> active todos </h1>
                </div>

                <div className='header-button-container' id="toggle-collapse-desc-button">
                    <CollapseButton funcToggleDesc={toggleCollapseAllActiveDesc} />
                </div>
            </div>

            <TodoListDisplay displayFulfilled={false} todos={todos} activeTodos={activeTodos} funcUpdateList={updateList} toggleDesc={toggleDesc} updateList={updateList} />

            {/* completed todos */}
            <div className='section-todos-header' >
                <div className='section-todos-header-icon' id="section-todos-header-icon-completed">
                    &gt;
                </div>

                <div className='section-todos-header-title' id="header-fulfilled" onClick={() => toggleVisibilityOfTodoLists("all-fulfilled-todos-container", "header-fulfilled")}>
                    <h1> completed todos </h1>
                </div>

                <div className='header-button-container' id='delete-fulfilled-todos-button'>
                    <TodoDeleteAllFulfilledButton funcUpdateList={updateList} />
                </div>

            </div>

            {/* render fulfilled todos list */}
            <TodoListDisplay displayFulfilled={true} todos={todos} activeTodos={activeTodos} toggleDesc={toggleDesc} updateList={updateList} />

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


    wie mach man gutes responsive design, sodass das nach verschieben nicht ass aussieht?

    typescript prob goated

    welche seite für design, canva?

    icon, header-state und collapse/delete-all button sind nicht coupled aneinander, wie würde man das am ehesten machen? useState für header und dann per props an elemente?
*/