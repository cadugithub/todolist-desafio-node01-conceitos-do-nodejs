const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { query } = require('express');

const app = express();

app.use(cors());
app.use(express.json());
const users = [];

function checksExistsUserAccount(request, response, next){

  const {username} = request.headers

  const user = users.find(user => user.username === username)

  if(!user){
    return response.status(400).json({error: "user not found"})
  }

  request.user = user

  return next()
}


app.post('/users',(request, response) => {
  const {name, username} = request.body
  
  const userExist = users.find(user => user.username === username)

  if(userExist){
    return response.status(400).json({error: "already exist user with this username"})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos:[]
  })
  return response.status(201).json({
    id: uuidv4(),
    name,
    username,
    todos:[]
  })
});

function searchTodo(todos, idTodo){
  const todo = todos.find(todo => todo.id === idTodo)
  
  return todo
}
app.get('/todos',checksExistsUserAccount, checksExistsUserAccount,(request, response) => {
  
  const {user} = request
  
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body
  const {user} = request

  user.todos.push({
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    creat_at: new Date(),
    done: false
  })

  return response.json(user.todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.query
  const {user} = request
  const {title, deadline} = request.body
  const todo = searchTodo(user.todos, id)

  if (!todo){
    return response.status(400).json({"error": "não há todo"})
  }

  todo.title = title
  todo.deadline = new Date(deadline)
  
  user.todos.forEach(element => {
   if(element.id === id){
    element = todo
   }
  });
  
  return response.json(user.todos)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {id} = request.query
  const {user} = request
  const todo = searchTodo(user.todos, id)

  if (!todo){
    return response.status(400).json({"error": "não há todo com esse código"})
  }
  todo.done = true

  user.todos.forEach(element => {
    if(element.id === id){
     element = todo
    }
   });

  return response.json(user.todos)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.query
  const {user} = request

  const updatedTodos = user.todos.filter(todo => todo.id !== id)
  user.todos = updatedTodos
  return response.json(user.todos)
});

module.exports = app;