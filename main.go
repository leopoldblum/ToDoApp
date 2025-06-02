package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/oklog/ulid/v2"

	"os"

	"github.com/gin-contrib/cors"
)

type Body struct {
	// json tag to de-serialize json body
	Title        string `json:"title"`
	Description  string `json:"desc"`
	Fulfilled    bool   `json:"fulfilled"`
	UserID       string `json:"userid"`
	OptimisticID string `json:"optimisticid"`
}

type Todo struct {
	// json tag to de-serialize json body+
	Id           string `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"desc"`
	Fulfilled    bool   `json:"fulfilled"`
	UserID       string `json:"userid"`
	OptimisticID string `json:"optimisticid"`
}

func autoInsertTodoInDB(title string, desc string, fulfilled bool, userid string, optimisticid string, getDB *sql.DB) bool {
	ulidID := ulid.Make().String() // creating ULID poggers
	// fmt.Printf("inserting with ULID: %s \n", ulidID)

	sqlStatement := "INSERT INTO todos (id, title, description, fulfilled, userid, optimisticid) VALUES ($1, $2, $3, $4, $5, $6)"
	// fmt.Println(sqlStatement)

	_, err := getDB.Exec(sqlStatement, ulidID, title, desc, fulfilled, userid, optimisticid)
	if err != nil {
		panic(err)
	}
	return true
}

func insertTodoWithSetIDInDB(id string, title string, desc string, fulfilled bool, userid string, optimisticid string, getDB *sql.DB) bool {
	sqlStatement := "INSERT INTO todos (id, title, description, fulfilled, userid, optimisticid) VALUES ($1, $2, $3, $4, $5, $6)"

	_, err := getDB.Exec(sqlStatement, id, title, desc, fulfilled, userid, optimisticid)
	if err != nil {
		panic(err)
	}
	return true
}

func main() {
	// load .env variables
	err := godotenv.Load()

	//setup connection to database

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

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

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{os.Getenv("CORS_ORIGIN")}
	router.Use(cors.New(corsConfig))

	// get entry with id
	router.GET("todo/:id", func(ctx *gin.Context) {
		sqlStatement := `SELECT id, title, description, fulfilled, userid FROM todos WHERE id=$1`
		var getId = ctx.Param("id")

		var title string
		var description string
		var fulfilled bool
		var userid string
		var optimisticid string

		row := db.QueryRow(sqlStatement, getId)

		switch err := row.Scan(&getId, &title, &description, &fulfilled, &userid, &optimisticid); err {
		case sql.ErrNoRows:
			ctx.IndentedJSON(http.StatusNotFound, "No entry with this ID found")
		case nil:
			// fmt.Println(getId, title, description, fulfilled)

			ctx.IndentedJSON(http.StatusOK, Todo{getId, title, description, fulfilled, userid, optimisticid})
		default:
			//panic(err)
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

	})

	// add entry with auto ID
	router.POST("todo", func(ctx *gin.Context) {
		body := Body{}

		if err := ctx.ShouldBindJSON(&body); err != nil {
			ctx.IndentedJSON(401, "couldnt bind body")
			return
		}
		// fmt.Println(body)

		if autoInsertTodoInDB(body.Title, body.Description, body.Fulfilled, body.UserID, body.OptimisticID, db) {
			ctx.IndentedJSON(http.StatusCreated, "succesfully added Entry")
		} else {
			ctx.IndentedJSON(http.StatusNotModified, "oops, something went wrong")
		}

	})

	// add with ID
	router.POST("todoWithID", func(ctx *gin.Context) {
		todo := Todo{}

		if err := ctx.ShouldBindJSON(&todo); err != nil {
			ctx.IndentedJSON(401, "couldnt bind body")
			return
		}

		if insertTodoWithSetIDInDB(todo.Id, todo.Title, todo.Description, todo.Fulfilled, todo.UserID, todo.OptimisticID, db) {
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
		var newUserid = body.UserID
		var newOptimisticid = body.OptimisticID

		sqlStatement := `UPDATE todos SET title = $2, description = $3, fulfilled = $4, userid = $5, optimisticid = $6 WHERE id=$1`

		_, err := db.Exec(sqlStatement, id_select, newTitle, newDesc, newFulfilled, newUserid, newOptimisticid)
		if err != nil {
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

		ctx.IndentedJSON(http.StatusOK, "succesfully updated Entry")

	})

	// get all todos
	router.GET("getalltodos", func(ctx *gin.Context) {
		sqlStatement := `SELECT * FROM todos ORDER BY id`

		rows, err := db.Query(sqlStatement)

		if err != nil {
			// panic("error")
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

		var results []Todo

		for rows.Next() {
			var item Todo

			err = rows.Scan(&item.Id, &item.Title, &item.Description, &item.Fulfilled, &item.UserID, &item.OptimisticID)

			if err != nil {
				// panic("sdaf")
				ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
			}

			results = append(results, item)
		}

		ctx.IndentedJSON(http.StatusOK, results)
	})

	// get all todos with specific user id
	router.GET("getalltodos/:userid", func(ctx *gin.Context) {
		var userid_select = ctx.Param("userid")

		sqlStatement := `SELECT * FROM todos WHERE userid=$1 ORDER BY id`

		rows, err := db.Query(sqlStatement, userid_select)

		if err != nil {
			// panic("error")
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
		}

		var results []Todo

		for rows.Next() {
			var item Todo

			err = rows.Scan(&item.Id, &item.Title, &item.Description, &item.Fulfilled, &item.UserID, &item.OptimisticID)

			if err != nil {
				// panic("sdaf")
				ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this Error: %d", err))
			}

			results = append(results, item)
		}

		ctx.IndentedJSON(http.StatusOK, results)
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

	// delete all fulfilled todos from a specific user
	router.DELETE("deleteAllFulfilledTodos/:userid", func(ctx *gin.Context) {
		var useridSel = ctx.Param("userid")

		sqlStatement := "DELETE FROM todos WHERE userid=$1 AND fulfilled=true"

		_, err := db.Query(sqlStatement, useridSel)

		if err != nil {
			ctx.IndentedJSON(http.StatusInternalServerError, fmt.Sprintf("Received this error: %d", err))
		}

		ctx.IndentedJSON(http.StatusOK, "deleted all fulfilled todos for this user sucessfully")
	})

	router.GET("/", func(c *gin.Context) {
		c.String(200, "API is running :D")
	})
	fmt.Println("CORS: " + os.Getenv("CORS_ORIGIN"))
	router.Run(os.Getenv("BACKEND_TARGET_URL"))
}
