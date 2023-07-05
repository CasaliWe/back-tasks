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

//PEGAR DADOS IMAGEM PERFIL E NOME RECEBENDO O UID
router.post('/pegarNomeImg', taskControllers.pegarNomeImg)

//VERIFICAR DATAS ANTES DE CRIAR NOVA SEMANA
router.post('/verificarDatasNovaSemana', taskControllers.verificarDatasNovaSemana)

//CRIAR NOVA SEMANA COM NOME E DATAS
router.post('/criarNovaSemana', taskControllers.criarNovaSemana)

//PEGAR TODAS AS SEMANA PARA EXIBIR NA HOME
router.post('/pegarSemanasHome', taskControllers.pegarSemanasHome)

//DELETAR SEMANA
router.post('/deletarSemana', taskControllers.deletarSemana)

//PEGAR DIAS
router.post('/pegarDias', taskControllers.pegarDias)

//PEGAR TASKS DIA
router.post('/pegarTasksDia', taskControllers.pegarTasksDia)

//CRIAR TASK
router.post('/criarTask', taskControllers.criarTask)

//EXCLUIR TASK
router.post('/excluirTask', taskControllers.excluirTask)

//CONCLUIR TASK
router.post('/concluirTask', taskControllers.concluirTask)

//PESQUISA
router.post('/pesquisaTask', taskControllers.pesquisaTask)





module.exports = router