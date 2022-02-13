import Task from "../model/task";
const express = require('express');

const TaskRouter = new express.Router();

TaskRouter.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

TaskRouter.get('/tasks', async(req, res) => {
    try {
        let tasks = await Task.find({});
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

TaskRouter.get('/tasks/:id', async(req, res) => {
    const _id = req.params.id
    try{
        let tasks = await Task.findById({ _id });
        if (!tasks) {
            res.status(404).send()
        }
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

TaskRouter.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ err: "error with values" })
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, validators: true });
        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

TaskRouter.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete({ _id });
        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

export default TaskRouter;
