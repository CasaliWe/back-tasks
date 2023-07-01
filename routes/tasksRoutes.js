const express = require('express')
const router = express.Router()

const taskControllers = require('../controllers/Controller')


//UPLOAD DE ARQUIVOS
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
          cb(null, "public/img/") 
    },
    filename: function(req, file, cb){
        cb(null, 'imgUsersPerfil-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage})






//SALVAR DADOS QUANDO CRIAR CONTA EMAIL E SENHA (IMG, NOME)
router.post('/salvarDadosStart',upload.single('arquivo'), taskControllers.salvarDados)






module.exports = router