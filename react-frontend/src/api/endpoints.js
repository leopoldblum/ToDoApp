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
/**
 * 
 * @param {(int | null)} id when null => autoId in database || when specified => add Todo with that ID in database 
 * @param {string} title title of todo
 * @param {string} desc description of todo
 * @param {boolean} fulfilled fulfillment-status of todo 
 */

export async function addTodo(id, title, desc, fulfilled, userID) {

    var todoBody;

    if (id === null) todoBody = { title: title, desc: desc, fulfilled: fulfilled, userID: userID };
    else todoBody = { id: id, title: title, desc: desc, fulfilled: fulfilled, userID: userID };

    try {
        // no id was specified
        const postNewTodoResponse = await fetch(
            id === null ? "http://localhost:8080/todo" : "http://localhost:8080/todoWithID",
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