const mongoose = require("mongoose")
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/truck-it",{
            useNewUrlParser: true,
            useCreateIndex: true
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