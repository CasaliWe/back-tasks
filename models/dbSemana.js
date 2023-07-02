const {DataTypes} = require('sequelize')

const db = require('../db/conn')
const Users = require('../models/dbUsers')


const Semanas = db.define('Semana', {
     TituloSemana: {
          type: DataTypes.STRING,
          required: true
     },
     Uid: {
          type: DataTypes.STRING,
          required: true
     }
})

Users.hasMany(Semanas)
Semanas.belongsTo(Users)

module.exports = Semanas