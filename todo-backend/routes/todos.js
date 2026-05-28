const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../data/tasks.json');

const readTasks = () => {
    const tasksData = fs.readFileSync(tasksFilePath);
    return JSON.parse(tasksData);
};

const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// GET all tasks
router.get('/', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// POST a new task
router.post('/', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        completed: false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

router.delete('/del/:id', (req, res) => {
    let tasks = readTasks();
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.status(200).send();
});

router.post('/completed/:id/:completed', (req, res) => {
    let tasks = readTasks();
    const taskId = parseInt(req.params.id, 10);
    const completedStatus = req.params.completed === 'true';
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks[taskIndex].completed = completedStatus;
    writeTasks(tasks);
    res.status(200).json(tasks[taskIndex]);
});

module.exports = router;
