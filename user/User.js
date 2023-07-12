const Sequelize = require('sequelize')
const connection = require('../database/database')




const User = connection.define('users',{
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//criar a tabela se nao existir no banco
//User.sync({force:false})

module.exports = User