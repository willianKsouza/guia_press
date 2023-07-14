const express = require('express')
const router = express.Router()
const adminAuth = require('../middlewares/adminAuth')
const Article = require('./Article')
const slugify = require('slugify')
const Category = require('../categories/Category')



router.get('/admin/articles',adminAuth, (req, res) => {
    Article.findAll({
        include:[
            {
                model:Category
            }
        ]
    }).then((articles) => {

        res.render('admin/articles/index', {
            articles
        })
    })
    
})


router.get('/admin/articles/new',adminAuth, (req, res) => {
    Category.findAll().then((categories) => {

        res.render('admin/articles/new', {
            categories
        })
    })
})

router.post('/articles/save',adminAuth, (req, res) => {
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

router.post('/articles/delete', adminAuth,(req, res) => {
    const id = req.body.deleteId
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })
        }
        else {
            res.redirect('/admin/articles')
        }
    } else {
        res.redirect('/admin/articles')
    }
})


router.get('/admin/articles/edit/:id',adminAuth, (req, res) => {
    const id = req.params.id

    if (id != undefined) {
        Article.findOne({
            where: {
                id:id
            }
        }).then(article => {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {
                    article,
                    categories
                })
            })
        })
    }
   
    
})


router.post('/articles/update', adminAuth,(req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const slug = slugify(title)
    const category = req.body.category 

    Article.update({
    title:title,
    slug:slug,
    body:body,
    categoryId:category
   },{
    where: {
        id:id 
    }
   }).then(() => {
    res.redirect('/admin/articles')
   }).catch(err => {
    res.redirect('/admin/articles')
   })
})


router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num
    let offset = 0

    if (isNaN(offset) || page == 1) {
        offset = 0
    }else {
        offset = parseInt(page - 1) * 3
    }


    Article.findAndCountAll({
        limit:3,
        offset:offset ,
        order:[
            ['id', 'DESC']
        ],
    }).then(articles => {

        let next
        if (offset + 3 >= articles.count) {
            next = false
        } else {
            next = true
        }
        const result = {
            page:parseInt(page),
            next,
            articles
        }

        Category.findAll().then(categories => {

            res.render('admin/articles/page', {
                result,
                categories
            })
        })
    })
})

module.exports = router