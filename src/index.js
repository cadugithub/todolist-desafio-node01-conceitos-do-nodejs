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
    return response.status(404).json({error: "user not found"})
  }

  request.user = user

  return next()
}

function searchTodo(todos, idTodo){
  const todoFinded = todos.find(todo => todo.id === idTodo)
  
  return todoFinded
}

app.post('/users', (request, response) => {
  const {name, username} = request.body  
  const userExist = users.find(user => user.username === username)
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos:[]
  }
  if(userExist){
    return response.status(400).json({error: "already exist user with this username"})
  }

  users.push(newUser)
  

  return response.status(201).json(newUser)
});


app.get('/todos', checksExistsUserAccount, checksExistsUserAccount,(request, response) => {
  
  const {user} = request
  
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body
  const {user} = request
  const newTodo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    creat_at: new Date(),
    done: false
  }
  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.query
  const {user} = request
  const {title, deadline} = request.body
  const todo = searchTodo(user.todos, id)

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
    return response.status(404).json({"error": "todo not found"})
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

  const todo = searchTodo(user.todos,id)
  

  if(!todo){
    return response.status(404).json({"error": "todo not found"})
  }

  const updatedTodos = user.todos.filter(todo => todo.id !== id)

  user.todos = updatedTodos
  
  return response.status(204).send()
});

module.exports = app;