const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req,res)=>{
        try{
            const todoItems = await Todo.find()
            const itemsLeft = await Todo.countDocuments({completed: false})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft})
        }catch(err){
            console.log(err)
            res.status(500).send('Error getting todos');
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({
                todo: req.body.todoItem,
                completed: false,
                picture: req.body.pictureUrl,
                deletePicture: req.body.deleteImageUrl,
                })
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
            res.status(500).send('Error creating todo');
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        const todo = await Todo.findById(req.body.todoIdFromJSFile);
        if (todo.deletePicture){
            fetch(todo.deletePicture, {
          method: 'GET',
        }).catch(err=>console.error("image delete failed",err)
        )
        console.log('Image deletion in progress (running in background)');
    }
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    