const mongoose= require("mongoose")
const uniqueValidator= require("mongoose-unique-validator")

const Schema = mongoose.Schema

//Creation of Vendor Schema
const vendorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: Number,
                min: 0,
                max: 5,
                default: 0
            },
            feedback: {
                type: String
            }
        }
    ],
    address: {
        type: String
    },
    payment: {
        bank_account:{
            name:{
                type: String
            },
            account_number: {
                type: Number
            },
            IFSC_code: {
                type: String
            },
            branch: {
                type: String
            }
        },
        paytm: {
                type: String
        }

    },
    document: {
        type: String,
    },
    isVerified: {
        type: String,
        default: false
    }
})

vendorSchema.plugin(uniqueValidator, { message: '{PATH} already present'})

//Creation of Vendor Model
const Vendor= mongoose.model('Vendor', vendorSchema)

module.exports= {
    Vendor
}

