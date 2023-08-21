
const express = require('express')

const adminController= require('../controller/adminController')

const admiRoute=express()

// post 

admiRoute.post('/login',adminController.veryfilogin)



// get

admiRoute.get('/customer',adminController.customerget)
admiRoute.get('/business',adminController.businessget)
admiRoute.get('/service',adminController.serviceget)



module.exports= admiRoute