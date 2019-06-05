const adminAccess = function(req, res, next) {    
    if(['admin'].includes(req.user.role)){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

const vendorAccess = function(req, res, next) {    
    if(['admin','vendor'].includes(req.user.role)){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

const customerAccess = function(req, res, next) {    
    if(['admin','customer'].includes(req.user.role)){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

module.exports = {
    adminAccess, vendorAccess, customerAccess
}