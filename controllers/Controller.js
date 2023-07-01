const ModelUsers = require('../models/dbUsers')

module.exports = class taskControllers {

        //SALVAR DADOS APÓS CRIAR COM EMAIL E SENHA
        static async salvarDados(req,res){   
            const ImgName = 'http://localhost:3000/img/' + req.file.filename;
            const Nome = req.body.nome   
            const Uid = req.body.uid

            await ModelUsers.create({ImgName,Nome,Uid})

            res.status(200).json('Usuário criado!')
        }

        
        //PEGAR DADOS IMAGEM PERFIL E NOME
        static async pegarNomeImg(req,res){
             const uid = req.body.uid

             const dados = await ModelUsers.findOne({where:{uid:uid}})

             res.status(200).json(dados)
        }


}