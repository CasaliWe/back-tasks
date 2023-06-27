const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const Users = db.define('User', {
     identificador: {
          type: DataTypes.STRING,
          required: true
     }
})

module.exports = Users