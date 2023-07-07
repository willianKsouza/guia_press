const express = require('express')
const app = express()
const connection = require('./database/database')
const bodyParser = require('body-parser')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')


const Article = require('./articles/Article')
const Category = require('./categories/Category')


//   view engine
app.set('view engine', 'ejs')

//   body parse - carregar parametros do form
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//   arquivos estaticos - enxergar
app.use(express.static('public'))

//DATABASE
connection.authenticate()
    .then(() => {
        console.log('sucesso na conexao')
    })
    .catch((error) => {
        console.log(`error: ${error}`);
    })





app.get('/', function(req, res) {
    Article.findAll().then((articles) => {
        res.render('index', {
            articles
        })
    })
})


app.use('/', categoriesController)
app.use('/', articlesController)




app.listen(8080, () => {
    console.log('servidor rodadno')
})