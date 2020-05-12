const {"v4": uuidv4} = require('uuid');

let tasks = [
    { id: '1', name: 'This is first', finalized: false },
    { id: '2', name: 'This is second', finalized: true },
    { id: '3', name: 'This is third', finalized: false },
    { id: '4', name: 'This is fourth', finalized: false },
    { id: '5', name: 'This is fifth', finalized: false },
    { id: '6', name: 'This is sixth', finalized: false },
    { id: '7', name: 'This is seventh', finalized: false },
];

function getTasks(req, res) {
    const page = req.query['page'] || 1;
    const itemsPerPage = req.query['items'] || 5;
    const order = req.query['order'];
    const search = req.query['search'];

    let taskList = tasks.slice(0);

    // Filter
    if(search){
        taskList = taskList.filter(task => task.name.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    }

    // Order
    if(order === 'ASC'){
        taskList = taskList.sort((task1, task2) => task1.name.toLowerCase() > task2.name.toLowerCase() ? 1 : -1);
    } else if(order === 'DESC'){
        taskList = taskList.sort((task1, task2) => task1.name.toLowerCase() < task2.name.toLowerCase() ? 1 : -1);
    }

    return res.json({
        rows : taskList.length,
        page : page,
        tasks: taskList.slice(0).splice( (page - 1) * itemsPerPage, itemsPerPage)
    })
}

function getTaskById(req, res){
    const id = req.params.id;
    const task = tasks.filter(task => task.id === id);

    if(task.length === 0){
        return res.status(404).json({error: 'Task not found'});
    }
    
    return res.json(task[0]);
}

function addTask(req, res){
    if(! req.body.name )
       return res.status(400).json({ error: 'Data missing'});

    const newTask = {
        id: uuidv4(),
        name: req.body.name,
        finalized: req.body.finalized
    }

    tasks.push(newTask);
    return res.json(newTask);
}

function updateTask(req, res){
    if(! req.body.name || ! req.body.id)
        return res.status(400).json({ error: 'Data missing'});

    let found = false;

    tasks.map(task => {
        if(task.id == req.body.id){
            task.name = req.body.name;
            task.finalized = req.body.finalized;
            found = true;
        }

        return task;
    });

    found ? 
    res.json({ message: 'success', task: { id: req.body.id, name: req.body.name, finalized: req.body.finalized }}) : 
    res.status(400).json({ error: `Task not found`});
}

function deleteTask(req, res){
    if(! req.params.id)
        return res.status(400).json({ error: 'Data missing'});

    const countTasks = tasks.length;
    tasks = tasks.filter(task => task.id !== req.params.id);

    countTasks !== tasks.length ? res.json({ message: 'Task deleted'}) : res.status(400).json({ error: `Task not found`});
}

function finalizeTask(req, res) {
    if(! req.params.id)
        return res.status(400).json({ error: 'Data missing'});

    let found = false;

    tasks = tasks.map(task => {
        if(task.id === req.params.id){
            task.finalized = true;
            found = true;
        }

        return task;
    });

    found ? res.json({ message: 'Task updated'}) : res.status(400).json({ error: `Task not found`});
}

module.exports = {
    getTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    finalizeTask
}