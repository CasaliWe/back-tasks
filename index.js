const express = require('express')

//BANCO
const conn = require('./db/conn') 

//ROTAS
const taskRoutes = require('./routes/tasksRoutes') 

//MODELS
const Users = require('./models/dbUsers')
const Semanas = require('./models/dbSemana')
const Dias = require('./models/dbDias')
const Task = require('./models/dbTask')

const cors = require('cors') 


const app = express()
app.use(cors())

app.use(
    express.urlencoded({
         extended: true
    })
)
app.use(express.json())
app.use(express.static('public')) 


//Rota principal
app.use('/', taskRoutes)



conn.sync().then(()=>{
    app.listen(3000)
}).catch((err) => console.log(err))
//  force:true   