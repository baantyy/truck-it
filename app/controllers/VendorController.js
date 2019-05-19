const express= require("express")
const _= require("lodash")
const router= express.Router()

const { User }= require("../models/User")
const { Vendor }= require("../models/Vendor")

const { userAuth }= require("../middlewares/auth")

//multer
const multer= require("multer")
const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads")
    },
    filename: function(req,file,cb){
        cb(null, Number(new Date()) + '_' + file.originalname)
    }
})

const fileFilter =(req,file,cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'application/pdf'){
        cb(null,true)
    }else{
        return cb(new Error('Only image or pdf is allowed'))
    }
}

const upload = multer({
    storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter
})

//localhost:3000/vendor
router.get("/",userAuth,function(req,res){
    Vendor.find({"user" : req.user._id})
        .populate('user','name mobile email')
            .then(function(vendor){
                res.send(vendor)
            })
            .catch(function(error){
                res.send({error})
            })
})

//localhost:3000/vendor
router.post("/",userAuth,upload.single('document'),function(req,res){
    const body= _.pick(req.body,["address","name","account_number","IFSC_code","branch","paytm","document"])
    body.user= req.user._id
    if(req.file){
        body.document = req.file.filename
    }
    const {name,account_number,IFSC_code,branch,paytm} = body
    body.payment = {
        bank_account: {name,account_number,IFSC_code,branch},
        paytm: paytm
    }
    const vendor= new Vendor(body)
    vendor.save()

        .then(function(vendor){
            res.send({
                vendor,
                notice: "Successfully inserted your information"

            })
        })
        .catch(function(err){
            res.send({
                err,
                notice: "Failed to enter your information"
            })
        })
})

//localhost:3000/vendor/:id
router.put("/:id",userAuth,upload.single('document'),function(req,res){
    const id= req.params.id
    const body= _.pick(req.body,["address","name","account_number","IFSC_code","branch","paytm","document"])
    //body.user= req.user._id
    if(req.file){
        body.document = req.file.filename
    }
    const {name,account_number,IFSC_code,branch,paytm} = body
    body.payment = {
        bank_account: {name,account_number,IFSC_code,branch},
        paytm: paytm
    }
    Vendor.findOneAndUpdate({_id:id},body,{new:true,runValidators:true})
        .then(function(vendor){
            res.send({
                vendor,
                notice: "Successfully updated"
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports= {
    vendorRouter: router
}
