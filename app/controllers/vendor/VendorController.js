const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Vendor } = require("../../models/Vendor")

const { auth } = require("../../middlewares/auth")
const { vendorAccess } = require("../../middlewares/access")
const upload = require("../../middlewares/fileupload")

//localhost:3005/vendors/my_profile
router.get("/my_profile", auth, vendorAccess, (req,res) => {
    Vendor.findOne({user: req.user._id})
        .then(vendor => {
            res.send({success: vendor})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendors/register
router.post("/register", (req,res) => {
    const body = _.pick(req.body,["user"])
    const vendor = new Vendor(body)
    vendor.save()
        .then(vendor => {
            res.send(vendor)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendors/update_profile
const updateFiles = upload.fields([{ name: 'pan', maxCount: 1 }, { name: 'aadhar', maxCount: 1 }])
router.put("/update_profile", auth, vendorAccess, updateFiles, (req,res) => {
    const id = req.user._id
    const { address, pincode, bank_account_number, bank_account_ifsc, pan, aadhar } = req.body
    const body = {
        address: {
            full: address,
            pincode
        },
        payment: {
            bank_account: {
                number: bank_account_number,
                ifsc: bank_account_ifsc
            }
        },
        document: {
            pan: req.files['pan'] ? req.files['pan'][0].location || req.files['pan'][0].filename : pan,
            aadhar: req.files['aadhar'] ? req.files['aadhar'][0].location || req.files['aadhar'][0].filename : aadhar
        }
    }
    Vendor.findOneAndUpdate({user: id}, body, {new: true, runValidators: true, context: 'query'})
        .then(vendor => {
            res.send({success: vendor})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    vendorRouter: router
}