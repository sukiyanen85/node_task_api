const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { addTask, getTasks, getTaskById, updateTask, deleteTask, finalizeTask } = require('./controllers/tasks.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function notImplemented(req, res){
    return res.status(501).json({ error: 'Not implemented'});
}

// GET Get all tasks
app.get('/tasks', getTasks);

// GET Get task by id
app.get('/tasks/:id', getTaskById);

// POST Add new task
app.post('/tasks', addTask);

// PUT Update task
app.put('/tasks/:id', updateTask);

// PUT Mark task as finalized
app.put('/tasks/:id/finalize', finalizeTask);

// DELETE Delete task
app.delete('/tasks/:id', deleteTask)

app.listen(port, () => console.log(`Server initialized port ${port}`));