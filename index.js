const express = require('express')

//IMPORTS
const conn = require('./db/conn') 
const taskRoutes = require('./routes/tasksRoutes') 
const Users = require('./models/dbUsers')

const app = express()

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