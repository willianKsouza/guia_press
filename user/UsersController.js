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

            res.redirect('/admin/users/create')
        }
    })
 
    
})



router.get('/login', (req, res) => {
    res.render('admin/users/login')
})


router.post('/authenticate', (req, res) => {
    const email = req.body.email
    const password = req.body.password


    User.findOne({
        where:{
            email:email
        }
    }).then(user => {
        if (user != undefined) {
            const correct = bcrypt.compareSync(password, user.password)
            if (correct) {
                req.session.user = {
                    id:user.id,
                    email:user.email
                }
                //admin@test.com"
                //12345
                    res.redirect('admin/articles')
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    })
})




router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router