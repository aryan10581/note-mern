

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const Note = require('./models/note.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://aryan10581:dc_ar_5789@cluster0.dj5bykn.mongodb.net/test')

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if (!user) {
        return { status: 'error', error: 'Invalid login' }
    }
    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (isPasswordValid) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            'secret123'
        )
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})
app.get('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const note_ = await Note.find({ email: email })
        const user = await User.findOne({ email: email })
        console.log('note_title', note_)



        return res.json({ status: 'ok', note_data: note_, user_det: user })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})
app.post('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email



        const doc = {
            name: `${req.body.name}`,
            password: `${decoded.password}`,
            email: `${email}`,
            note: `${req.body.note}`,
            title: `${req.body.title}`,
            time: Date()
        }

        await Note.insertMany(doc)
        return res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})
app.put('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email





        await Note.deleteOne({ _id: req.body.id })
        return res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.listen(1337, () => {
    console.log('Server started on 1337')
})
