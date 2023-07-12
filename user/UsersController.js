const express = require('express')
const User = require('./User')

const router = express.Router()

router.get('/admin/users', (req, res) => {
    res.send('listagem de usuarios')
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    res.json({email, password})
})









module.exports = router