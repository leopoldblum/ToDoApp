import Todo from "../components/TodoEntry.astro"

const todoListContainer = document.getElementById("todoListContainer");

const refreshButtons = document.getElementsByClassName(
    "refreshTodoListButton",
);

for (let rButton of refreshButtons) {
    rButton.addEventListener("click", (e) => refreshTodos());
}


async function refreshTodos() {

    console.log("pressed button?")

    try {
        const getTodos = await fetch("http://localhost:8080/todos");
        const allEntries = await getTodos.json();

        let testEntry = allEntries[0];

        todoListContainer.innerHTML = "<Todo todoEntry={" + testEntry.title + "} />"


    }
    catch (err) {
        console.error(err);
    }



}