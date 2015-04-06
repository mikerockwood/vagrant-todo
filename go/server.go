package main

import (
  "fmt"
  "encoding/json"
  "time"
  "bytes"
  "net/http"
  "github.com/go-martini/martini"
  "github.com/jinzhu/gorm"
  _ "github.com/lib/pq"
 )

type Todo struct {
  Id         int
  Item       string
  CreatedAt  time.Time
  UpdatedAt  time.Time
  DeletedAt  time.Time
}

func main() {
  m := martini.Classic()
  // TODO: Static() brings all files to the root, maybe find a better way to structure this
  m.Use(martini.Static("../html/"))
  m.Use(martini.Static("../css/"))
  m.Use(martini.Static("../react/build/"))

  //
  // DB init
  //
  db, err := gorm.Open("postgres", "user=todolist password=todolist dbname=todolist sslmode=disable")
  if err != nil {
    panic(err.Error()) // HACK: This isn't proper error handling, but it will be fixed
  }
  db.DropTable(&Todo{})
  db.CreateTable(&Todo{})
  db.AutoMigrate(&Todo{})

  defer db.Close()

  //
  // API functions
  //
  m.Get("/todo", func(res http.ResponseWriter) {
    /*
    Get all Todo list items. Since this is a GET, it takes no arguments.
    Responds with a JSON object containing a list of each item on the list.
    */
    var todoList []Todo

    db.Find(&todoList)

    todoListEncoded := marshalResponseJson(todoList)

    res.Header().Set("Content-Type", "application/json")
    res.Write(todoListEncoded)
  })

  m.Post("/todo", func(req *http.Request) string {
    /*
    Create a new Todo list item. Accepts a JSON object with name "Item" that
    contains the value of the new Todo list item to append.
    */
    newItem := decodeRequestJson(req)

    db.Create(&newItem)

    return newItem.Item
  })

  m.Put("/todo/:id", func(req *http.Request, params martini.Params) string {
    /*
    Update an existing Todo list item. Takes the Todo's ID in the URL, and a
    JSON object with name "Item" in the body that contains the value to change.
    */
    // TODO: Make this fail for deleted item
    var todo Todo

    itemUpdate := decodeRequestJson(req)
    db.First(&todo, params["id"]).Update("Item", itemUpdate.Item)

    return "Put todo\n"
  })

  m.Delete("/todo/:id", func(params martini.Params) string {
    /*
    Delete an existing Todo list item. Takes the ID of the Todo to be deleted
    in the URL.
    */
    var todo Todo
    db.First(&todo, params["id"]).Delete(&todo)

    return "Deleted todo\n"
  })

  m.RunOnAddr(":8080")
}

func marshalResponseJson(todoList []Todo) []byte {
  /*
  Create a JSON object from the todo list.
  */
  marshalledList, err := json.Marshal(todoList)
  if err != nil {
    panic("Marshalling error")
  }

  return marshalledList
}

func decodeRequestJson(req *http.Request) Todo {
  /*
  Decode the JSON passed in the request.
  */
  var rawTodoItem [128]byte // HACK: This should not be a fixed size
  var item Todo

  _, requestError := req.Body.Read(rawTodoItem[:])
  decoder := json.NewDecoder(bytes.NewReader(rawTodoItem[:]))

  decodeError := decoder.Decode(&item)
  if decodeError != nil {
    fmt.Printf("%b", rawTodoItem)
    panic("Decode error")
  }

  if requestError != nil && requestError.Error() != "EOF" {
    // It is recommended that request errors be handled AFTER dealing with
    // request data.
    panic(requestError.Error())
  }
  defer req.Body.Close()

  return item
}
