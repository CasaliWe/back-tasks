const express = require('express')
const router = express.Router()

const taskControllers = require('../controllers/Controller')

//Rotas principais
router.get('/', taskControllers.teste)


module.exports = router