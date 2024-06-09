package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// speichert alle TODOs, vorerst local ohne DB
var todos = []todo{
	{ID: "1", Title: "Erster Task", Description: "dies ist der erste Task", Fulfilled: false},
	{ID: "2", Title: "zweiter Task", Description: "dies ist der zweite Task", Fulfilled: false},
	{ID: "3", Title: "dritter Task", Description: "dies ist der dritte Task", Fulfilled: false},
}

// album represents data about a record album.
type todo struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"desc"`
	Fulfilled   bool   `json:"fulfilled"`
}

// gebe alle TODOs zurück
func getTodos(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, todos)
}

// füge TODO hinzu
func postTodos(t *gin.Context) {
	var newTodo todo

	if err := t.BindJSON(&newTodo); err != nil {
		return
	}

	todos = append(todos, newTodo)
	t.IndentedJSON(http.StatusCreated, newTodo)
}

// gebe bestimmten TODO zurück
func getTodoByID(t *gin.Context) {
	id := t.Param("id")

	for _, a := range todos {
		if a.ID == id {
			t.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	t.IndentedJSON(http.StatusNotFound, gin.H{"message": "TODO not found!"})

	/* t.IndentedJSON(http.StatusOK, getTodoHELPER(t.Param("id"))) */
}

// sets fullfilled -> true
func setFulfillTodo(t *gin.Context) {
	id := t.Param("id")

	for x, a := range todos {
		if a.ID == id {
			todos[x].Fulfilled = true
			t.IndentedJSON(http.StatusAccepted, "set to true \n\r")
			return
		}
	}
}

func changeTitle(id string, newTitle string) bool {

	for x, a := range todos {
		if a.ID == id {
			todos[x].Title = newTitle
			return true
		}
	}

	return false
}

func main() {
	router := gin.Default()
	router.GET("/todos", getTodos)
	router.GET("/todos/:id", getTodoByID)
	router.GET("/todos/:id/setFulfilled", setFulfillTodo)

	router.GET("/todos/:id/title/:newTitle", func(t *gin.Context) {
		id := t.Param("id")
		newTitle := t.Param("newTitle")
		if changeTitle(id, newTitle) {
			t.IndentedJSON(http.StatusAccepted, "succesfully changed title")
		} else {
			t.IndentedJSON(http.StatusNotModified, "oops, something went wrong")
		}

	})

	router.POST("/todos", postTodos)

	router.Run("localhost:8080")
}
