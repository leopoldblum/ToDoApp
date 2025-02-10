import React, { useState, useEffect } from 'react';
import './TodoList.css'
import TodoCheckmarkButton from './TodoCheckmarkButton';
import TodoAddButton from './TodoAddButton';
import TodoDeleteButton from "./TodoDeleteButton";
import TodoDeleteAllFulfilledButton from './TodoDeleteAllFulfilledButton';

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

    const toggleVisibilityOfTodoLists = (elemIDtoToggle, headerID) => {
        const toggleVisibilityElem = document.getElementById(elemIDtoToggle);

        const headerTypeID = document.getElementById(headerID);

        if (toggleVisibilityElem.classList.contains("visible")) {
            toggleVisibilityElem.style.height = 0;

            toggleVisibilityElem.classList.remove("visible");
            toggleVisibilityElem.classList.add("hidden")
            headerTypeID.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        else {

            toggleVisibilityElem.classList.remove("hidden")
            toggleVisibilityElem.classList.add("visible")
            toggleVisibilityElem.style.height = toggleVisibilityElem.scrollHeight + "px";

            toggleVisibilityElem.addEventListener("transitionend", () => headerTypeID.scrollIntoView({ behavior: "smooth", block: "start" }), { once: true });
        }
    }


    useEffect(() => {
        updateList();
    }, []);

    if (todos.length === 0) {
        return <p> loading or empty </p>
    }

    return (
        <div id="todoList">

            {/* render add todo button form */}
            <TodoAddButton funcUpdateList={updateList} />


            {/* Active Todos */}
            <div className='section-todos-header'>
                <div className='section-todos-header-title' id="header-actives" onClick={() => toggleVisibilityOfTodoLists("all-active-todos-container", "header-actives")}>
                    <h1> active todos </h1>
                </div>

                <div className='header-button-container'>
                    <button onClick={() => updateList()} id='header-button'> collapse all desc  </button>
                </div>
            </div>

            {/* render todo list */}
            <div id="all-active-todos-container" className='hidden'>
                {todos.filter(entries => entries.fulfilled === false).map((entries) => (

                    <div className='todoEntry-container' key={entries.id}>

                        <div className="todoEntry-box todo-title" onClick={() => toggleDesc(entries.id)}> {entries.title} </div>

                        <div className="todoEntry-box"> <TodoCheckmarkButton currentTodo={entries} funcUpdateList={updateList} /> </div>

                        {/* statt komplett neu zu rendern, lieber visibility togglen, das erlaubt transitions */}
                        {activeTodos.includes(entries.id) && (
                            <div className="todoEntry-desc-popup">
                                <div className="todoEntry-desc-text">{entries.desc}</div>
                                {/* <div className="todoEntry-desc-delete">  delete   </div> */}
                                <TodoDeleteButton currentTodo={entries} funcUpdateList={updateList} />

                            </div>
                        )}
                    </div>
                ))
                }
            </div>

            {/* completed todos */}


            <div className='section-todos-header' >
                <div className='section-todos-header-title' id="header-fulfilled" onClick={() => toggleVisibilityOfTodoLists("all-fulfilled-todos-container", "header-fulfilled")}>
                    <h1> completed todos </h1>
                </div>

                <div className='header-button-container' id='delete-fulfilled-todos-button'>
                    <TodoDeleteAllFulfilledButton funcUpdateList={updateList} />
                </div>

            </div>

            <div id="all-fulfilled-todos-container" className='hidden'>
                {todos.filter(entries => entries.fulfilled === true).map((entries) => (

                    <div className='todoEntry-container todoEntryCompleted-container' key={entries.id}>

                        <div className="todoEntry-box todo-title todo-title-linethrough " onClick={() => toggleDesc(entries.id)}  >  {entries.title}  </div>


                        <div className="todoEntry-box"> <TodoCheckmarkButton currentTodo={entries} funcUpdateList={updateList} /> </div>

                        {/* statt komplett neu zu rendern, lieber visibility togglen, das erlaubt transitions */}
                        {activeTodos.includes(entries.id) && (
                            <div className="todoEntry-desc-popup">
                                <div className="todoEntry-desc-text">{entries.desc}</div>
                                {/* <div className="todoEntry-desc-delete">  delete   </div> */}
                                <TodoDeleteButton currentTodo={entries} funcUpdateList={updateList} />

                            </div>
                        )}
                    </div>
                ))
                }
            </div>
            <button onClick={() => updateList()}> update? </button>

            {/* button to delete all completed Todos */}

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


    wie mach man gutes responsive design, sodass das nach verschieben nicht ass aussieht?
*/