const express = require("express")
const aws = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")

const { awsS3 } = require("../../config/apikey")

aws.config.update({
    secretAccessKey: awsS3.secretAccessKey,
    accessKeyId: awsS3.accessKeyId,
    region: awsS3.region
})

const s3 = new aws.S3()

//aws file storing
const storageS3 = multerS3({
    s3: s3,
    bucket: 'truckit',
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname)
    }
})

//local file storing
const internalStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads")
    },
    filename: function(req,file,cb){
        cb(null, Number(new Date()) + '_' + file.originalname)
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true)
    }else{
        cb(new Error('Invalid Mime Type, only JPEG & PNG'),false)
    }
}

const upload = multer({
    storage: internalStorage, 
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter
})

//const upload = require("../fileupload")
// router.post("/image-upload", upload.single("image"), (req,res) => {
//     res.send(req.file.location)
// })
// router.post("/image-upload", upload.array("image",5), (req,res) => {
//     res.send(req.files)
// })

module.exports = upload