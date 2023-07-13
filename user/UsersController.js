const express = require('express')
const User = require('./User')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {
            users
        })
    })
   
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({
        where: {
            email:email
        }
    }).then((user) => {
        if (user == undefined) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email,
                password:hash
            }).then((req, res) => {
                res.redirect('/')
            }).catch((err) => {
                res.redirect('/')
            })
        }else{
            const aviso = 'usuario ja existe!!!'
            res.redirect('/admin/users/create')
        }
    })
 
    
})









module.exports = router