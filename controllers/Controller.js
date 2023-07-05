const ModelUsers = require('../models/dbUsers')
const ModelDias = require('../models/dbDias')
const ModelSemana = require('../models/dbSemana')
const ModelTasks = require('../models/dbTask')

const { Op } = require('sequelize');


module.exports = class taskControllers {

        //SALVAR DADOS APÓS CRIAR COM EMAIL E SENHA
        static async salvarDados(req,res){   
            const ImgName = 'https://wcprojeto.shop/img/' + req.file.filename;
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
                const dia = data.getDate();
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
                console.log(datasBanco)
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
                if(datasBanco.length > 0){
                    var datasFormatadasJaExistentes = []

                    datasBanco.forEach((data)=>{
                        var dia = data.FullData.getDate() < 10 ? '0' + data.FullData.getDate() : data.FullData.getDate()
                        var mes = data.FullData.getMonth() +1 < 10 ? '0' + (data.FullData.getMonth() +1) : data.FullData.getMonth() +1
                        var ano = data.FullData.getFullYear()
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
                const dia = data.getDate();
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
              
                try{

                    const semanas = await ModelSemana.findAll({include: ModelDias, where:{Uid:Uid}})
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

                }catch(error){

                    res.status(404).json({err: err})

                }

        }



        //DELETAR SEMANA
        static async deletarSemana(req,res){
              const Uid = req.body.uid
              const Id = req.body.id
              
              try {

                  //PEGANDO OS DIAS PARA DELETAR
                  const idsDias = []
                  const dias = await ModelDias.findAll({raw:true, where:{Uid: Uid, SemanaId: Id}})
                  dias.forEach((dia)=>{
                      idsDias.push(dia.id)
                  })


                  //DELETANDO A SEMANA E OS DIAS
                  await ModelDias.destroy({where: {id:idsDias}})
                  await ModelSemana.destroy({where:{id: Id, Uid: Uid}})

                  res.status(200).json('Semana deletada!')
                
              } catch (error) {

                  res.status(404).json({err: err})

              }
        }




        //PEGAR DIAS
        static async pegarDias(req,res){
                const Uid = req.body.uid
                const Id = req.body.id

                try {

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
                    
                } catch (error) {

                    res.status(404).json({err: error})

                }

        }




        //PEGAR TASKS DIA
        static async pegarTasksDia(req,res){
              const Uid = req.body.uid
              const SemanaId = req.body.semanaId
              const DiaId = req.body.diaId
           
              try {

                    //BUSCANDO TODOS OS DIAS DA SEMANA
                    const dias = await ModelDias.findAll({raw:true, where:{Uid: Uid, SemanaId: SemanaId}})

                    //FORMATANDO
                    const diasRes = []
                    dias.forEach((dia)=>{
                        var dataString = new Date(dia.FullData)
                        var diaNumero = dataString.getDate()
                        var diaData = dataString.getDay()  
                        var diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
                        var dia = {id: dia.id, uid: dia.Uid, semanaId: dia.SemanaId, dia: diaSemana[diaData], numero:diaNumero, full:dia.FullData}
                        diasRes.push(dia)
                    })

                    


                    //BUSCANDO O DIA CLICADO JUNTO COM SUAS TASKS
                    const tasks = await ModelDias.findOne({include: ModelTasks, where:{id:DiaId, Uid: Uid, SemanaId: SemanaId}})
                    
                    //FORMATANDO
                    var dataString = new Date(tasks.dataValues.FullData)
                    var diaNumero = dataString.getDate()
                    var diaData = dataString.getDay()  
                    var diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
                    var taskFull = {tasks: tasks.dataValues.id, uid: tasks.dataValues.Uid, semanaId: tasks.dataValues.SemanaId, dia: diaSemana[diaData], numero:diaNumero, full:tasks.dataValues.FullData, tasks: tasks.dataValues.Tasks}

                    
                    //FAZENDO A SUBSTITUIÇÃO DO DIA, PELO DIA COM SUAS TASKS
                    diasRes.forEach((dia, i)=>{
                            if(dia.numero == taskFull.numero){
                                diasRes[i] = taskFull
                            }
                    })

        
                    res.status(200).json(diasRes)
                
              } catch (error) {

                    res.status(404).json({err: error})
                
              }
        }



        //CRIAR TASK
        static async criarTask(req,res){
               const uid = req.body.uid
               const idSemana = req.body.idSemana
               const idDia = req.body.idDia
               const hora = req.body.hora
               const content = req.body.content

               const dados = {
                  Conteudo: content,
                  Concluida: false,
                  HorarioTask: parseInt(hora),
                  Uid: uid,
                  SemanaId: idSemana,
                  DiaId: idDia
               }
               
               //CRIAR TASK
               await ModelTasks.create(dados)
               
               res.status(200).json('Anotação criada!')
        }




        //EXCLUIR TASK
        static async excluirTask(req,res){
              const uid = req.body.uid
              const semanaId = req.body.semanaId
              const diaId = req.body.diaId
              const id = req.body.taskId

              try {

                 await ModelTasks.destroy({where:{id: id, Uid: uid, SemanaId: semanaId, DiaId: diaId}})

                 res.status(200).json('Anotação deletada')
                
              } catch (error) {
                
                 res.status(404).json({err: error})

              }

        }




        //CONCLUIR TASK
        static async concluirTask(req,res){
            const uid = req.body.uid
            const semanaId = req.body.semanaId
            const diaId = req.body.diaId
            const id = req.body.taskId
           
            try {
                
                const task = await ModelTasks.findOne({ where: { id: id, Uid: uid, SemanaId: semanaId, DiaId: diaId } });
                const valorAtual = task.Concluida;
                const novoValor = !valorAtual;
                await ModelTasks.update({ Concluida: novoValor }, { where: { id: id, Uid: uid, SemanaId: semanaId, DiaId: diaId } });

                res.status(200).json('Tarefa Concluída')

            } catch (error) {

                res.status(404).json({err: error})
                
            }
        }



        //FAZER PESQUISA
        static async pesquisaTask(req,res){
            const uid = req.body.uid;
            const pesquisa = req.body.pesquisa;
            
            try {
                
                //const que terá os dados finais
                const dadosFinais = []
                
                //buscando as tasks da pesquisa
                const resPesquisa = await ModelTasks.findAll({
                    raw: true,
                    where: {
                        Uid: uid,
                        Conteudo: { [Op.like]: `%${pesquisa}%` }
                    }
                });
    
                console.log(resPesquisa)
                
                //verifica se veio alguma task
                if (resPesquisa.length > 0) {
                    const promises = resPesquisa.map(task => pegarDadosPai(task));
                    await Promise.all(promises);
                }
                
                //func que pega os dados da tabela pai onde tem o dia, e organiza os dados para envia para o front
                async function pegarDadosPai(task) {
    
                    //buscando dados tabela pai
                    var pai = await ModelDias.findOne({
                        raw: true,
                        where: { id: task.DiaId, Uid: task.Uid }
                    });
                    
                    //ajustando o dia
                    var diaTask = pai.FullData.getDate() < 10 ? '0' + pai.FullData.getDate() : pai.FullData.getDate();
                    var mesTask = pai.FullData.getMonth() + 1 < 10 ? '0' + (pai.FullData.getMonth() + 1) : pai.FullData.getMonth() + 1;
                    var anoTask = pai.FullData.getFullYear()
                    var dataFinalTask = `${diaTask}/${mesTask}/${anoTask}`;
                    
                    //organizando a resposta
                    var resDados = {
                        data: dataFinalTask,
                        hora: task.HorarioTask,
                        conteudo: task.Conteudo,
                        concluida: task.Concluida,
                        uid: task.Uid,
                        semana: task.SemanaId,
                        dia: task.DiaId,
                        id: task.id
                    };
                    
                    //salvando no array para enviar para o front 
                    dadosFinais.push(resDados);
                }
    
                res.status(200).json(dadosFinais);

            } catch (error) {

                res.status(404).json({err: error});
                
            }

        }
}