const express= require('express')

const userController=require('../controller/userController')
const { router } = require('json-server')
const userRoute= express()


// post
userRoute.post('/register',userController.userRegisterpost)
userRoute.post('/purpose',userController.userPurpose)


// get
userRoute.get('/user',userController.userget)






module.exports= userRoute
