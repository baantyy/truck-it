const express = require("express")
const cors = require("cors")
const path = require('path')

const { mongoose } = require("./config/database")
const { routes } = require("./config/routes")

const app = express()
const port = process.env.PORT || 3005

app.use(express.json())
app.use(cors())
app.use("/api",routes)
app.use("/uploads",express.static("uploads"))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'client/build')))
    app.get('*', (req,res) =>{
        res.sendFile(path.join(__dirname+'/client/build/index.html'))
    })
}

app.listen(port,function(){
    console.log("Listening on port " + port)
})