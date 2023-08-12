const express= require('express')

const userController=require('../controller/userController')
const { router } = require('json-server')
const userRoute= express()


// post
userRoute.post('/register',userController.userRegisterpost)
userRoute.post('/purpose',userController.userPurpose)
userRoute.post('/otp',userController.postotp)
userRoute.post('/login',userController.loginuser)
userRoute.post('/setpassword',userController.setpassword)


// get
userRoute.get('/user',userController.userget)






module.exports= userRoute
