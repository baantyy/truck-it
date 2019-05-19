const express= require("express")
const _=require("lodash")
const router= express.Router()

const { User }= require("../../models/User")
const { Vendor }= require("../../models/Vendor")

const { userAuth }= require("../../middlewares/auth")
const { adminAccess }= require("../../middlewares/access")


//localhost:3005/admin/vendor/venderUser
router.get("/venderUser",userAuth,adminAccess,function(req,res){
    User.find().where('role').in('vendor')
        .then((users)=> {
            res.send(users)
        })
        .catch((err)=> {
            res.send(err)
        })
})

//localhost:3005/admin/vendor/venderDetails
router.get("/venderDetails",userAuth,adminAccess,function(req,res){
    Vendor.find()
        .then((users)=> {
            res.send(users)
        })
        .catch((err)=> {
            res.send(err)
        })
})

//localhost:3005/admin/vendor:id
router.get("/:id",userAuth,adminAccess,function(req,res){
    const id= req.params.id
    Vendor.findOne({_id:id})
    .populate('user')
        .then((vendor)=> {
            res.send(vendor)
        })
        .catch((err)=> {
            res.send(err)
        })

})

//localhost:3005/admin/vendor:id
router.put("/:id",userAuth,adminAccess,function(req,res){
    const id= req.params.id
    const body=  _.pick(req.body,["isVerified"])
    console.log("hi")
    Vendor.findOneAndUpdate({_id: id},body,{new:true,runValidators:true})
    .populate('user')
        .then(function(vendor){
            res.send(vendor)
        })
        .catch(function(err){
            res.send(err)
    })
})

//localhost:3005/admin/vendor:id
router.delete("/:id",userAuth,adminAccess,function(req,res){
    const id = req.params.id
    Vendor.findByIdAndDelete(id)
        .then(function(vendor){
            if(user){
                res.send({
                    vendor,
                    notice: "Successfully Deleted"
                })
            }else{
                res.status("404").send({
                    notice: "page not found"
                })
            }
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports= {
    vendorAdminController: router
}

