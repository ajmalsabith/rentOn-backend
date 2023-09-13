const express= require('express')

const userController=require('../controller/userController')
const vehicleController=require('../controller/vehicleController')
const chatController=require('../controller/chatController')
const paymentController=require('../controller/paymentController')
const profileController=require('../controller/profileController')
const userRoute= express()

const multer=require('multer')
const path=require('path')


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/vehicleimg'))
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})

const upload=multer({storage:storage})



/// post

// user
userRoute.post('/register',userController.userRegisterpost)
userRoute.post('/purpose',userController.userPurpose)
userRoute.post('/otp',userController.postotp)
userRoute.post('/login',userController.loginuser)
userRoute.post('/setpassword',userController.setpassword)
userRoute.put('/editprofile',upload.single('image'),profileController.editprofile)
userRoute.post('/subscription',paymentController.subscriptiontaken)
userRoute.post('/viewprofile',profileController.viewprofile)




//vehicle
userRoute.post('/vehicleAdd',upload.fields([{name:'image'},{name:'proof'}]),vehicleController.addVehicle)
userRoute.post('/editvehicle',vehicleController.editvehicleget)
userRoute.post('/removevehi',vehicleController.removevehicle)
userRoute.post('/singleview',vehicleController.singleview)
userRoute.post('/saveimg',vehicleController.saved)
userRoute.post('/removesaved',vehicleController.removesaved)
userRoute.post('/makechange',vehicleController.makechange)
userRoute.post('/showfaster',paymentController.showfaster)
userRoute.post('/sendlike',vehicleController.sendlike)
userRoute.post('/editvehiclepost',upload.fields([{name:'image'},{name:'proof'}]),vehicleController.editvehicle)

/// get


userRoute.get('/profile',profileController.getprofile)
userRoute.get('/editprofileget',profileController.editprofileload)
userRoute.get('/home',userController.gethome)
userRoute.get('/getsevices',userController.serviceget)
userRoute.get('/getbusiness',userController.businessget)
userRoute.get('/savedDatas',vehicleController.getsaved)



// chat 

userRoute.post('/getchat',chatController.newcreatechat)
userRoute.post('/getmessage',chatController.getmessage)
userRoute.post('/sendmessage',chatController.sendmessage)

//get
userRoute.get('/getchatdata',chatController.getchatdata)




module.exports= userRoute
