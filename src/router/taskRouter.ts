import auth from "../middleware/auth";
import Task from "../model/task";
const express = require('express');

const TaskRouter = new express.Router();

TaskRouter.post('/tasks', auth, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        await task.save();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

TaskRouter.get('/tasks', auth, async (req, res) => {
    try {
        // let tasks = await Task.find({owner:req.user._id});
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

TaskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        let tasks = await Task.findById({ _id, owner: req.user._id });
        if (!tasks) {
            res.status(404).send()
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

TaskRouter.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ err: "error with values" })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

TaskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

export default TaskRouter;
