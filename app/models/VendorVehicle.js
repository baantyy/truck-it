const mongoose = require("mongoose")
//const validator = require("validator") 
const Schema = mongoose.Schema
const vendorVehicleSchema = new Schema({

   vName : {
        type : String,
        minlength : [5,'name i'],
        required : [true,'name is required']
   },
   vCapacity :{
       type : Number,
       default : 900,
       
   },
   vImage: {
    type: String,
    default: 'null'
   },
   helperRates : {
       type : Number,
       default : 1
   },
   vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'vendor is required']
   },
    dimension :{
        length : Number,
        breadth : Number ,
        height : Number
    },
    pricing :{
        interCity:{

            ratePerKm :{
                type :  Number,
                required : true
            },
            ratePerMin :{
                type :  Number,
                required : true
            }
        },

        intraCity:{

            ratePerKm :{
                type :  Number,
                required : true
            },
            ratePerMin :{
                type :  Number,
                required : true
            }
        } 
    }

})

const VendorVehicle = mongoose.model("VendorVehicle",vendorVehicleSchema)
module.exports = {
    VendorVehicle
}  

