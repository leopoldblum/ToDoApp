package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"github.com/gin-contrib/cors"
)

type Body struct {
	// json tag to de-serialize json body
	Title       string `json:"title"`
	Description string `json:"desc"`
	Fulfilled   bool   `json:"fulfilled"`
}

type Todo struct {
	// json tag to de-serialize json body+
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"desc"`
	Fulfilled   bool   `json:"fulfilled"`
}

const (
	host     = "localhost"
	port     = 5432
	user     = "username"
	password = "password"
	dbname   = "postgres"
)

func insertTodoInDB(title string, desc string, fulfilled bool, getDB *sql.DB) bool {
	sqlStatement := "INSERT INTO todos (title, description, fulfilled) VALUES ($1, $2, $3)"
	//sqlStatement := `INSERT INTO todos (title, description, fulfilled) VALUES ('test_inVSCode23423423', 'test_desc23423432', false)`

	_, err := getDB.Exec(sqlStatement, title, desc, fulfilled)
	return err == nil
	/* if err != nil {
		return false
		//panic(err)
	}
	return true */
}

func main() {
	//setup connection to database
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")

	router := gin.Default()

	router.Use(cors.Default())

	// get entry with id
	router.GET("todo/:id", func(ctx *gin.Context) {
		sqlStatement := `SELECT id, title, description, fulfilled FROM todos WHERE id=$1`
		var getId = ctx.Param("id")

		var title string
		var description string
		var fulfilled bool

		row := db.QueryRow(sqlStatement, getId)

		switch err := row.Scan(&getId, &title, &description, &fulfilled); err {
		case sql.ErrNoRows:
			ctx.IndentedJSON(http.StatusNotFound, "No entry with this ID found")
		case nil:
			fmt.Println(getId, title, description, fulfilled)

			idToInt, err := strconv.Atoi(getId)
			if err != nil {
				ctx.IndentedJSON(http.StatusBadRequest, "wrong id")
			}

			ctx.IndentedJSON(http.StatusFound, Todo{idToInt, title, description, fulfilled})
		default:
			//panic(err)
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

	})

	// add entry
	router.POST("todo", func(ctx *gin.Context) {
		body := Body{}

		if err := ctx.ShouldBindJSON(&body); err != nil {
			ctx.IndentedJSON(401, "couldnt bind body")
			return
		}
		//fmt.Println(body)

		if insertTodoInDB(body.Title, body.Description, body.Fulfilled, db) {
			ctx.IndentedJSON(http.StatusCreated, "succesfully added Entry")
		} else {
			ctx.IndentedJSON(http.StatusNotModified, "oops, something went wrong")
		}

	})

	// update
	router.POST("updateTodo/:id", func(ctx *gin.Context) {
		var id_select = ctx.Param("id")

		body := Body{}

		if err := ctx.ShouldBindJSON(&body); err != nil {
			ctx.IndentedJSON(401, "couldnt bind body")
			return
		}

		var newTitle = body.Title
		var newDesc = body.Description
		var newFulfilled = body.Fulfilled

		sqlStatement := `UPDATE todos SET title = $2, description = $3, fulfilled = $4 WHERE id=$1`

		_, err := db.Exec(sqlStatement, id_select, newTitle, newDesc, newFulfilled)
		if err != nil {
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

		ctx.IndentedJSON(http.StatusOK, "succesfully updated Entry")

	})

	// get all todos
	router.GET("todos", func(ctx *gin.Context) {
		sqlStatement := `SELECT * FROM todos ORDER BY id`

		rows, err := db.Query(sqlStatement)

		if err != nil {
			// panic("error")
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

		var results []Todo

		for rows.Next() {
			var item Todo

			err = rows.Scan(&item.Id, &item.Title, &item.Description, &item.Fulfilled)

			if err != nil {
				// panic("sdaf")
				ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
			}

			results = append(results, item)
		}

		ctx.IndentedJSON(http.StatusFound, results)
	})

	// delete
	router.DELETE("todo/:id", func(ctx *gin.Context) {
		var idSel = ctx.Param("id")

		sqlStatement := `DELETE FROM todos WHERE id=$1`

		_, err := db.Exec(sqlStatement, idSel)

		if err != nil {
			// panic("error")
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

		ctx.IndentedJSON(http.StatusOK, "deleted successfully")
	})

	router.DELETE("deleteAllFulfilledTodos", func(ctx *gin.Context) {
		sqlStatement := "DELETE FROM todos WHERE fulfilled=true"

		_, err := db.Query(sqlStatement)

		if err != nil {
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this error: %d", err))
		}

		ctx.IndentedJSON(http.StatusOK, "deleted all fulfilled todos sucessfully")
	})

	router.Run("localhost:8080")
}

// TODO:

// Frontend:
// Frameworks: react, sveltekit, astro (-> astro_island)
// cors issues fixen!

// page mit allen todos
// auf todos klicken -> details auf neuer page anzeigen
// page stylen mit tailwind

// LATER:
// delete & update
// swagger
