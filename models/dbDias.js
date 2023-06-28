const {DataTypes} = require('sequelize')

const db = require('../db/conn')
const Users = require('../models/dbUsers')
const Semanas = require('../models/dbSemana')


const Dias = db.define('Dias', {
     Dia: {
        type: DataTypes.INTEGER,
        required: true
     },
     FullData: {
        type: DataTypes.DATE,
        required: true
     }
})

Users.hasMany(Dias)
Semanas.hasMany(Dias)
Dias.belongsTo(Users)
Dias.belongsTo(Semanas)

module.exports = Dias