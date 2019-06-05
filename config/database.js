const mongoose = require("mongoose")
require('dotenv').config()

mongoose.Promise = global.Promise
const server = process.env.MY_TRUCKIT_SERVER
const db = process.env.MY_TRUCKIT_DB

mongoose.connect(`mongodb://${server}/${db}`,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(function(){
            console.log("DB is connected")
        })
        .catch(function(){
            console.log("DB is not connected")
        })
        
module.exports = {
    mongoose
}