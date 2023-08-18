const express= require('express')

const userController=require('../controller/userController')
const vehicleController=require('../controller/vehicleController')
const { router } = require('json-server')
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

//vehicle
userRoute.post('/vehicleAdd',upload.fields([{name:'image'},{name:'proof'}]),vehicleController.addVehicle)




/// get
userRoute.get('/user',userController.userget)
userRoute.get('/profile',userController.getprofile)






module.exports= userRoute
