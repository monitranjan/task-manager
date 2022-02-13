const express = require('express');
import User from "../model/user";

const UserRouter = new express.Router();

UserRouter.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

UserRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        console.log(user)
        res.send(user)
    } catch (error) {
        res.status(400).send()
    }
})

UserRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})

UserRouter.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById({ _id });
        if (!user) {
            res.status(404).send()
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e)
    }
})

UserRouter.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ err: "error with values" })
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

UserRouter.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete({ _id });
        if (!user) {
            res.status(404).send()
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e)
    }
})

export default UserRouter;