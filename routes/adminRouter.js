
const express = require('express')

const adminController= require('../controller/adminController')
const vehicleController= require('../controller/vehicleController')

const admiRoute=express()

// post 

admiRoute.post('/login',adminController.veryfilogin)
admiRoute.post('/actions',adminController.useractions)
admiRoute.post('/verification',adminController.verification)




// get

admiRoute.get('/customer',adminController.customerget)
admiRoute.get('/business',adminController.businessget)
admiRoute.get('/service',adminController.serviceget)

admiRoute.get('/paymentdata',adminController.getpaymentdata)
admiRoute.get('/dashboard',adminController.dashboardget)

//vehicle
admiRoute.get('/vehiclelist',vehicleController.vehiclelist)

//post 
admiRoute.post('/vehicleactions',vehicleController.vehicleactions)




module.exports= admiRoute