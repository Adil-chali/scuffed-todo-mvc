const express = require('express')
const router = express.Router()
const todosController = require('../controllers/todos')

router.get('/', todosController.getTodos)

router.post('/createTodo', todosController.createTodo)

router.put('/toggleComplete', todosController.toggleComplete)

router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router