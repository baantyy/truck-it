const adminAccess = function(req, res, next) {    
    if(req.user.role === "admin"){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

const vendorAccess = function(req, res, next) {    
    if(req.user.role === "vendor" || req.user.role === "admin"){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

const customerAccess = function(req, res, next) {    
    if(req.user.role === "customer" || req.user.role === "admin"){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

module.exports = {
    adminAccess, vendorAccess, customerAccess
}