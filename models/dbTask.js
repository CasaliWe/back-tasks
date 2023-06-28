const {DataTypes} = require('sequelize')

const db = require('../db/conn')
const Users = require('../models/dbUsers')
const Semanas = require('../models/dbSemana')
const Dias = require('../models/dbDias')


const Tasks = db.define('Task', {
    Conteudo: {
       type: DataTypes.STRING,
       required: true
    },
    Concluida: {
       type: DataTypes.BOOLEAN,
       required: true
    },
    HorarioTask: {
       type: DataTypes.TIME,
       required: true
    }
})

Users.hasMany(Tasks)
Semanas.hasMany(Tasks)
Dias.hasMany(Tasks)
Tasks.belongsTo(Users)
Tasks.belongsTo(Semanas)
Tasks.belongsTo(Dias)

module.exports = Tasks