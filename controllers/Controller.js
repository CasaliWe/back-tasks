const ModelUsers = require('../models/dbUsers')
const ModelDias = require('../models/dbDias')
const ModelSemana = require('../models/dbSemana')

const { Op } = require('sequelize');


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


        //VERIFICAR DATAS ANTES DE CRIAR A SEMANA
        static async verificarDatasNovaSemana(req,res){
                const dataFront = req.body.date
                const uid = req.body.uid

                // Converter a string em objeto de data
                const data = new Date(dataFront);

                // Extrair dia, mês e ano
                const dia = data.getDate() +1;
                const mes = data.getMonth();
                const ano = data.getFullYear();

                // Finalizar nova datas
                const dataInicial = new Date(ano, mes, dia);
                var datasJaExistentes = [];

                for (let i = 0; i < 7; i++) {
                    const novaData = new Date(dataInicial);
                    novaData.setDate(novaData.getDate() + i);
                    datasJaExistentes.push(novaData);
                }
               
                // Busca as datas no banco
                const datasBanco = await ModelDias.findAll({raw: true,where:{FullData: datasJaExistentes, Uid: uid}});
                
                // Definir a resposta
                var inicioFinal = null

                if(datasBanco.length == 0){
                    //pegando dia, mes e ano data inicial
                    const diaInicial = datasJaExistentes[0].getDate() < 10 ? '0' + datasJaExistentes[0].getDate() : datasJaExistentes[0].getDate()
                    const mesInicial = datasJaExistentes[0].getMonth() +1 < 10 ? '0' + (datasJaExistentes[0].getMonth() +1) : datasJaExistentes[0].getMonth() +1
                    const anoInicial = datasJaExistentes[0].getFullYear()
                    const dataInicioFormatada = `${diaInicial}/${mesInicial}/${anoInicial}`

                    //pegando dia, mes e ano data final
                    const diaFinal = datasJaExistentes[6].getDate() < 10 ? '0' + datasJaExistentes[6].getDate() : datasJaExistentes[6].getDate()
                    const mesFinal = datasJaExistentes[6].getMonth() +1 < 10 ? '0' + (datasJaExistentes[6].getMonth() +1) : datasJaExistentes[6].getMonth() +1
                    const anoFinal = datasJaExistentes[6].getFullYear()
                    const dataFinalFormatada = `${diaFinal}/${mesFinal}/${anoFinal}`


                    inicioFinal = {inicio: dataInicioFormatada, final: dataFinalFormatada}
                }

                
                //SE EXISTIR DATAS JÁ CADASTRADAS, FORMATA TODAS ANTES DE ENVIAR PARA O FRONT
                if(datasJaExistentes.length > 0){
                    var datasFormatadasJaExistentes = []

                    datasJaExistentes.forEach((data)=>{
                        var dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
                        var mes = data.getMonth() +1 < 10 ? '0' + (data.getMonth() +1) : data.getMonth() +1
                        var ano = data.getFullYear()
                        var dataFinal = `${dia}/${mes}/${ano}`
                        datasFormatadasJaExistentes.push(dataFinal)
                    })

                    datasJaExistentes = datasFormatadasJaExistentes
                }


                const resposta = {inicioFinal, datasJaExistentes: datasJaExistentes}


                res.status(200).json(resposta)
        }



        //CRIAR NOVA SEMANA COM NOME E DATAS
        static async criarNovaSemana(req,res){
                var date = req.body.date
                var nome = req.body.nome
                var uid = req.body.uid


                // Converter a string em objeto de data
                const data = new Date(date);

                // Extrair dia, mês e ano
                const dia = data.getDate() +1;
                const mes = data.getMonth();
                const ano = data.getFullYear();

                // Finalizar nova datas
                const dataInicial = new Date(ano, mes, dia);
                var datasParaSalvar = [];

                for (let i = 0; i < 7; i++) {
                    const novaData = new Date(dataInicial);
                    novaData.setDate(novaData.getDate() + i);
                    datasParaSalvar.push(novaData);
                }


                //SALVAR NOVAS DATAS NO BANCO COM UID
                const semana = await ModelSemana.create({TituloSemana: nome, Uid: uid})

                //SALVANDO TODAS AS NOVAS DATAS PASSANDO O ID DA SEMANA
                await ModelDias.bulkCreate(datasParaSalvar.map((data) => ({ FullData: data, SemanaId: semana.dataValues.id, Uid: uid}))); 

                res.status(200).json('SemanaCriada!')
        }
  



        //PEGAR SEMANAS PARA EXIBIR NA HOME
        static async pegarSemanasHome(req,res){
              const Uid = req.body.uid
              
              const semanas = await ModelSemana.findAll({include: ModelDias}, {where:{Uid:Uid}})
              const semanasDias = semanas.map((result)=> result.get({plain:true}))


              //PEGANDO NOME, ID E DIAS INICIAL / FINAL
              var semanaTitleDiaInicialFinal = []

              semanasDias.forEach((semana)=>{ 
                    //pegando dia, mes e ano INICIO
                    var dia = semana.Dias[0].FullData.getDate() < 10 ? '0' + semana.Dias[0].FullData.getDate() : semana.Dias[0].FullData.getDate()
                    var mes = semana.Dias[0].FullData.getMonth() +1 < 10 ? '0' + (semana.Dias[0].FullData.getMonth() +1) : semana.Dias[0].FullData.getMonth() +1
                    var ano = semana.Dias[0].FullData.getFullYear()
                    var dataFormatada = `${dia}/${mes}/${ano}`

                    //pegando dia, mes e ano FINAL
                    var dia2 = semana.Dias[6].FullData.getDate() < 10 ? '0' + semana.Dias[6].FullData.getDate() : semana.Dias[6].FullData.getDate()
                    var mes2 = semana.Dias[6].FullData.getMonth() +1 < 10 ? '0' +( semana.Dias[6].FullData.getMonth() +1) : semana.Dias[6].FullData.getMonth() +1
                    var ano2 = semana.Dias[6].FullData.getFullYear()
                    var data2Formatada = `${dia2}/${mes2}/${ano2}`
                
                    var InicioFinal = {inicio: dataFormatada, final: data2Formatada}

                    var infos = {id: semana.id, Titulo: semana.TituloSemana, UserId: semana.Uid, InicioFinal}
                    
                    semanaTitleDiaInicialFinal.push(infos)
              })


              res.status(200).json(semanaTitleDiaInicialFinal)
        }



        //DELETAR SEMANA
        static async deletarSemana(req,res){
              const Uid = req.body.uid
              const Id = req.body.id
               
              //PEGANDO OS DIAS PARA DELETAR
              const idsDias = []
              const dias = await ModelDias.findAll({raw:true, where:{Uid: Uid, SemanaId: Id}})
              dias.forEach((dia)=>{
                  idsDias.push(dia.id)
              })


              //DELETANDO A SEMANA E OS DIAS
              await ModelDias.destroy({where: {id:idsDias}})
              await ModelSemana.destroy({where:{id: Id, Uid: Uid}})

              res.json('Semana deletada!')
        }




        //PEGAR DIAS
        static async pegarDias(req,res){
                const Uid = req.body.uid
                const Id = req.body.id

                const dias = await ModelDias.findAll({raw:true, where:{Uid: Uid, SemanaId: Id}})

                //FORMATANDO A DATA
                const diasRes = []
                dias.forEach((dia)=>{
                    var dataString = new Date(dia.FullData)
                    var diaNumero = dataString.getDate()
                    var diaData = dataString.getDay()  
                    var diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
                    var dia = {id: dia.id, uid: dia.Uid, semanaId: dia.SemanaId, dia: diaSemana[diaData], numero:diaNumero, full:dia.FullData}
                    diasRes.push(dia)
                })

                res.status(200).json(diasRes)
        }
}