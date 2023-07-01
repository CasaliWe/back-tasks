const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const Users = db.define('User', {
     Uid: {
          type: DataTypes.STRING,
          required: true
     },
     Nome: {
          type: DataTypes.STRING,
          required: true
     },
     ImgName: {
          type: DataTypes.STRING,
          required: true
     }
})

module.exports = Users