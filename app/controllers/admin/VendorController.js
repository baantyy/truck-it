const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Vendor } = require("../../models/Vendor")

const { auth } = require("../../middlewares/auth")
const { adminAccess } = require("../../middlewares/access")
const upload = require("../../middlewares/fileupload")

//localhost:3005/admin/vendors
router.get("/", auth, adminAccess, (req,res) => {
    Vendor.find().select("vehicles")
        .then(vendor => {
            res.send(vendor)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vendors/:id
router.get("/:id", auth, adminAccess, (req,res) => {
    const user = req.params.id
    Vendor.findOne({user})
        .then(vendor => {
            res.send(vendor)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vendors/:id
router.delete("/:id", auth, adminAccess, (req,res) => {
    const user = req.params.id
    Vendor.findOneAndDelete({user})
        .then(vendor => {
            if(vendor){
                res.send({ success: "successfully deleted" })
            }else{
                res.status("404").send({ failed: "vendor not found" })
            }
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vendors/:id
const updateFiles = upload.fields([{ name: 'pan', maxCount: 1 }, { name: 'aadhar', maxCount: 1 }])
router.put("/:id", auth, adminAccess, updateFiles, (req,res) => {
    const user = req.params.id
    const { address, pincode, bank_account_number, bank_account_ifsc, pan, aadhar, isVerified } = req.body
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
        },
        isVerified
    }
    Vendor.findOneAndUpdate({user}, body, {new: true, runValidators: true, context: 'query'})
        .then(vendor => {
            res.send({success: vendor})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    adminVendorRouter: router
}