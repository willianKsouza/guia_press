const express = require('express')
const app = express()
const connection = require('./database/database')
const bodyParser = require('body-parser')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const usersController = require('./user/UsersController')
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')


//   view engine
app.set('view engine', 'ejs')

//   body parse - carregar parametros do form
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//   arquivos estaticos - enxergar
app.use(express.static('public'))



app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)




//DATABASE
connection.authenticate()
    .then(() => {
        console.log('sucesso na conexao')
    })
    .catch((error) => {
        console.log(`error: ${error}`);
    })





app.get('/', function(req, res) {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit:3
    }).then((articles) => {


        Category.findAll().then(categories => {
            res.render('index', {
                articles,
                categories
            })
        })

    })
})



app.get('/:slug', (req, res) => {
    const slug = req.params.slug
    Article.findOne({
        where: {
            slug:slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', {
                    article,
                    categories
                })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })

})

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug
    Category.findOne({
        where:{
            slug:slug  
        },
        include:[{model: Article}]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', {
                    articles:category.articles,
                    categories
                })
            })
        }else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.listen(8080, () => {
    console.log('servidor rodadno')
})