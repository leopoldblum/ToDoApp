package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Body struct {
	// json tag to de-serialize json body
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
	if err != nil {
		//return false
		panic(err)

	}
	return true
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

	router.POST("/postCreateDB", func(ctx *gin.Context) {
		sqlStatement := `CREATE TABLE todos (id SERIAL PRIMARY KEY,title TEXT not NULL,description TEXT not NULL,fulfilled BOOLEAN not NULL)`

		_, err = db.Exec(sqlStatement)
		if err != nil {
			panic(err)
		}
	})

	router.POST("/postTodoDB", func(ctx *gin.Context) {
		sqlStatement := `INSERT INTO todos (title, description, fulfilled) VALUES ('test_inVSCode', 'test_desc', false)`

		_, err = db.Exec(sqlStatement)
		if err != nil {
			panic(err)
		}
	})

	router.GET("getTodoDB", func(ctx *gin.Context) {
		sqlStatement := `SELECT id, title, description, fulfilled FROM todos WHERE id=$1`
		var id int

		var title string
		var description string
		var fulfilled bool

		row := db.QueryRow(sqlStatement, 5)

		switch err := row.Scan(&id, &title, &description, &fulfilled); err {
		case sql.ErrNoRows:
			fmt.Println("No rows were returned!")
		case nil:
			fmt.Println(id, title, description, fulfilled)
			ctx.IndentedJSON(http.StatusFound, "found id")
		default:
			panic(err)
		}
	})

	// adds entry to DB, details are saved in body of message
	router.POST("postTodoDBWithBody", func(ctx *gin.Context) {
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

	router.Run("localhost:8080")
}
