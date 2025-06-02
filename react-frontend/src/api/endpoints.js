// const backendURL = process.env.REACT_APP_BACKENDURL
const backendURL = import.meta.env.VITE_BACKENDURL;

/**
 * =============================
 * Section: fetching
 * =============================
 */

export const fetchAllTodos = async (userid) => {
    try {
        const response = await fetch(`${backendURL}/getalltodos/` + userid)
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
 * @param {(int | null)} id when null => autoId in backend || when specified => add Todo with that ID in database 
 * @param {string} title title of todo
 * @param {string} desc description of todo
 * @param {boolean} fulfilled fulfillment-status of todo 
 */

export async function addTodo(id, title, desc, fulfilled, userid, optimisticid) {

    var todoBody;

    if (id === null) todoBody = { title: title, desc: desc, fulfilled: fulfilled, userid: userid, optimisticid: optimisticid };
    else todoBody = { id: id, title: title, desc: desc, fulfilled: fulfilled, userid: userid, optimisticid: optimisticid };

    // console.log("adding auto - body: " + JSON.stringify(todoBody))

    try {
        // no id was specified
        const postNewTodoResponse = await fetch(
            id === null ? `${backendURL}/todo` : `${backendURL}/todoWithID`,
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

export async function editTodo(id, title, desc, fulfilled, userid, optimisticid) {

    const todoBody = { title: title, desc: desc, fulfilled: fulfilled, userid: userid, optimisticid: optimisticid };

    try {
        const updateResponse = await fetch(
            `${backendURL}/updateTodo/` + id,
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
        throw error
    }
}


export
    async function deleteTodo(todoID) {
    if (todoID === null)
        throw new Error("todoID is null, cant delete todo!");

    try {
        const response = await fetch(
            `${backendURL}/todo/` + todoID,
            {
                method: "DELETE",
            },
        );

        // console.log("deleteResponse: " + response.status);

        if (!response.ok) {
            throw new Error("Error - Response Status:" + response.status);
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}


/**
 * =============================
 * Section: additional 
 * =============================
 */


export async function deleteAllFulfilledTodos(userid) {
    try {
        const response = await fetch(
            `${backendURL}/deleteAllFulfilledTodos/` + userid,
            {
                method: "DELETE",
            },
        );


        if (!response.ok) {
            throw new Error("Error - Response Status:" + response.status);
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}