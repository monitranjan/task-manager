const express = require('express');
import User from "../model/user";
import auth from "../middleware/auth";
const UserRouter = new express.Router();

UserRouter.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

UserRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user, token })
    } catch (error) {
        res.status(400).send()
    }
})

UserRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

UserRouter.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

UserRouter.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
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

UserRouter.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ err: "error with values" })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

UserRouter.delete('/users/me',auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
})

export default UserRouter;