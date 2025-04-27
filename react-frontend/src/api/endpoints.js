/**
 * =============================
 * Section: fetching
 * =============================
 */

export const fetchAllTodos = async () => {
    try {

        const response = await fetch("http://localhost:8080/todos")
        const allEntries = await response.json();

        return allEntries;
    }
    catch (error) {
        console.error("recv error:", error);
        throw error;
    }
}

/**
 * =============================
 * Section: CRUD 
 * =============================
 */

export async function addTodo(inputTitle, inputDesc) {

    const todoBody = { title: inputTitle, desc: inputDesc, fulfilled: false };

    try {
        const postNewTodoResponse = await fetch(
            "http://localhost:8080/todo",
            {
                method: "POST",
                body: JSON.stringify(todoBody),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (!postNewTodoResponse.ok) {
            throw new Error(
                "Error - Response Status:" + postNewTodoResponse.status,
            );
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function editTodo(id, title, desc, fulfilled) {

    const todoBody = { title: title, desc: desc, fulfilled: fulfilled };

    try {
        const updateResponse = await fetch(
            "http://localhost:8080/updateTodo/" + id,
            {
                method: "POST",
                body: JSON.stringify(todoBody),
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

    } catch (error) {
        console.error(error);
    }
}


export
    async function deleteTodo(todoID) {
    if (todoID === null)
        throw new Error("todoID is null, cant delete todo!");

    try {
        const response = await fetch(
            "http://localhost:8080/todo/" + todoID,
            {
                method: "DELETE",
            },
        );

        // console.log("deleteResponse: " + response.status);

        if (!response.ok) {
            throw new Error("Error - Response Status:" + response.status);
        }

        // todoFuncAndData.updateList();
    } catch (error) {
        console.error(error);
    }
}


/**
 * =============================
 * Section: additional 
 * =============================
 */


export async function deleteAllFulfilledTodos() {
    try {
        const response = await fetch(
            "http://localhost:8080/deleteAllFulfilledTodos",
            {
                method: "DELETE",
            },
        );


        if (!response.ok) {
            throw new Error("Error - Response Status:" + response.status);
        }
    } catch (error) {
        console.error(error);
    }
}