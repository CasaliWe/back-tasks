const ModelUsers = require('../models/dbUsers')

module.exports = class taskControllers {

        //SALVAR DADOS APÓS CRIAR COM EMAIL E SENHA
        static async salvarDados(req,res){   
            const ImgName = req.file.filename;
            const Nome = req.body.nome   
            const Uid = req.body.uid

            await ModelUsers.create({ImgName,Nome,Uid})

            res.status(200).json('Usuário criado!')
        }


}