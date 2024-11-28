import React, { useState, useEffect } from 'react';
import './TodoList.css'
import TodoCheckmarkButton from './TodoCheckmarkButton';
import TodoAddButton from './TodoAddButton';


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

            {/* render todo list */}
            {todos.map((entries) => (

                <div className='todoEntry-container' key={entries.id}>

                    {entries.fulfilled
                        ? <div className="todoEntry-box todo-title todo-title-linethrough " onClick={() => toggleDesc(entries.id)}  >     {entries.title}  </div>
                        : <div className="todoEntry-box todo-title" onClick={() => toggleDesc(entries.id)}  >     {entries.title} </div>
                    }


                    <div className="todoEntry-box"> <TodoCheckmarkButton currentTodo={entries} todo={todos} setTodos={setTodos} funcUpdateList={updateList} /> </div>


                    {activeTodos.includes(entries.id) && (
                        <div className="todoEntry-desc-popup">
                            <div className="todoEntry-desc-text">{entries.desc}</div>
                            <div className="todoEntry-desc-delete">  delete   </div>
                        </div>
                    )}
                </div>
            ))
            }
            <button onClick={() => updateList()}> update? </button>

        </div>
    );
}


export default TodoList;


/*
    gibt es ne elegantere Lösung für updateList, damit die function nicht als prop weitergegeben werden muss?

        function foo(){} 
            vs 
        const foo = () => {}

*/