import React, { useState, useEffect } from 'react';
import './TodoList.css'

const TodoList = () => {

    const [todos, setTodos] = useState([])

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8080/todos")
            const allEntries = await response.json();

            setTodos(allEntries);

        }
        catch (error) {
            console.error("recv error:", error);
        }
    }

    const todoToggleFulfill = async (todoID) => {
        if (todoID === null)
            throw new Error("todoID is null, cant update fulfillment!");

        const getDataResponse = await fetch(
            "http://localhost:8080/todo/" + todoID,
        );
        const myData = await getDataResponse.json();

        myData.fulfilled = !myData.fulfilled;

        try {
            const updateResponse = await fetch(
                "http://localhost:8080/updateTodo/" + todoID,
                {
                    method: "POST",
                    body: JSON.stringify(myData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!updateResponse.ok) {
                throw new Error(
                    "Error - Response Status:" + updateResponse.status,
                );
            }

            console.log(
                "fulfillment - updateResponse: " + updateResponse.status,
            );

            // LOL, reactivity ig
            // location.reload();

            fetchData();
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        fetchData();
    }, []);

    if (todos.length === 0) {
        return <p> loading or empty </p>
    }

    return (
        <div id="todoList">
            {todos.map((entries) => (
                // <h2 className="todoEntry" key={entries.id} > {entries.title} <h2/>  <p> {entries.desc} ==--  <button id="test"> {entries.fulfilled.toString()} </button> 

                <div className="todoEntry" key={entries.id}>
                    <p className='todoTitle'>  {entries.title} </p>
                    <p className='todoDesc'>   {entries.desc} </p>
                    <button className="todoButton" onClick={() => todoToggleFulfill(entries.id)}> {entries.fulfilled.toString()} </button>
                </div>
            ))
            }
            <button onClick={() => fetchData()}> update? </button>

        </div>
    );
}




export default TodoList;