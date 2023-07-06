const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
    res.send('rota de articles')
})


router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then((categories) => {

        res.render('admin/articles/new', {
            categories
        })
    })
})

router.post('/articles/save', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:category
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

module.exports = router