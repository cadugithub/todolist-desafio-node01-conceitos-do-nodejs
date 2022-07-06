const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());
const users = [];

function checksExistsUserAccountWithUsername(request, response, next) {
  const {username} = request.headers

  const user = users.find(user => user.username === username)
  console.log(username)
  if(user){
    return response.status(400).json({error: "already exist user with this username"})
  }
  request.user = user

  return next()
}

function checksExistsUserAccount(request, response, next){
  const {username} = request.headers

  const user = users.find(user => user.username === username)
  console.log(username)
  if(!user){
    return response.status(400).json({error: "user not found"})
  }
  request.user = user

  return next()
}


app.post('/users', checksExistsUserAccountWithUsername,(request, response) => {
  const {name, username} = request.body

  users.push({
    id: uuidv4,
    name,
    username,
    todos:["Minhas atividades"]
  })
  return response.json(users[0])
});

app.get('/todos', (request, response) => {
  const {username} = request.headers

  const user = users.find(user => user.username === username)
  console.log(user)
  const todo = user.todos
  
  return response.json(todo)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;