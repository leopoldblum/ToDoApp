import React, { useState, useEffect } from 'react';
import './TodoList.css'
import TodoCheckmarkButton from './TodoCheckmarkButton';
import TodoAddButton from './TodoAddButton';
import TodoDeleteButton from "./TodoDeleteButton";

const TodoList = () => {

    const [todos, setTodos] = useState([])
    const [activeTodos, setActiveTodos] = useState([])

    const updateList = async () => {
        try {

            const response = await fetch("http://localhost:8080/todos")
            const allEntries = await response.json();


            // setTimeout(() => setTodos(allEntries), 200);
            setTodos(allEntries);
            // setCompletedTodos(allEntries.filter(openTodos);

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
                <div className='section-todos-header-title'>
                    <h1> active todos </h1>
                </div>

                <div className='header-button-container'>
                    <button onClick={() => updateList()} id='header-button'> collapse all desc  </button>
                </div>
            </div>

            {/* render todo list */}
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

            {/* completed todos */}


            <div className='section-todos-header'>
                <div className='section-todos-header-title'>
                    <h1> completed todos </h1>
                </div>

                <div className='header-button-container'>
                    <button onClick={() => updateList()} id='header-button'> clear completed todos WIP  </button>
                </div>

            </div>


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

    wie sollte die pop up description am besten getoggled werden?

    wie mach man gutes responsive design, sodass das nach verschieben nicht ass aussieht?
*/