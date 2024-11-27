import React, { useState, useEffect } from 'react';
import './TodoList.css'
import TodoCheckmarkButton from './TodoCheckmarkButton';

const TodoList = () => {

    const [todos, setTodos] = useState([])

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

    useEffect(() => {
        updateList();
    }, []);

    if (todos.length === 0) {
        return <p> loading or empty </p>
    }

    return (
        <div id="todoList">
            {todos.map((entries) => (
                // <h2 className="todoEntry" key={entries.id} > {entries.title} <h2/>  <p> {entries.desc} ==--  <button id="test"> {entries.fulfilled.toString()} </button> 

                // <div className="todoEntry" key={entries.id}>

                //     <p className='todoTitle'>  {entries.title} </p>

                //     <TodoCheckmarkButton currentTodo={entries} todo={todos} setTodos={setTodos} funcUpdateList={updateList} />

                //     <p className='todoDesc'>   {entries.desc} </p>

                // </div>

                <div className='todoEntry-container' key={entries.id}>
                    <div className="todoEntry-box todo-title">  {entries.title}  </div>
                    <div className="todoEntry-box todo-desc">   {entries.desc}  </div>
                    <div className="todoEntry-box">             <TodoCheckmarkButton currentTodo={entries} todo={todos} setTodos={setTodos} funcUpdateList={updateList} /> </div>
                </div>

            ))
            }


            <button onClick={() => updateList()}> update? </button>

        </div>
    );
}




export default TodoList;