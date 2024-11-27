import React from "react";
import Checkbox from '@mui/material/Checkbox';
import "./TodoCheckmarkButton.css"


const TodoCheckmarkButton = ({ currentTodo, funcUpdateList }) => {


    // console.log("are props working?: fulfilled:", props.todo.fulfilled)

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

            // console.log(
            //     "fulfillment - updateResponse: " + updateResponse.status,
            // );

            funcUpdateList();
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div id="todoButtonContainer">
            {/* <p> this todo is: {currentTodo.fulfilled.toString()}</p> */}
            <Checkbox classes={{ root: 'custom-checkbox-root' }} checked={currentTodo.fulfilled} onChange={() => todoToggleFulfill(currentTodo.id)} color="primary" />
            {/* <button className="todoButton" onClick={() => todoToggleFulfill(currentTodo.id)}> {currentTodo.fulfilled.toString()} </button> */}
        </div>
    );
}

export default TodoCheckmarkButton