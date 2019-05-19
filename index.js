const express = require("express")
const cors = require("cors")

const { mongoose } = require("./config/database")
const { routes } = require("./config/routes")

const app = express()
const port = process.env.PORT || 3005

app.use(express.json())
app.use(cors())
app.use("/",routes)

app.listen(port,function(){
    console.log("Listening on port " + port)
}) 