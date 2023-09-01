
const mongoose = require('mongoose')


const subscriptionschema= new mongoose.Schema({

    userId:{
        type:String,
        required:true 
    },
    userName:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    subscriptionType:{
        type:String,
        required:true
    },
    purpose:{
        type:String,
        required:true

    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        default:new Date()
    },
    endDate:{
        type:String,
        
    },
    vehicleId:{
        type:String
    }
})


module.exports = mongoose.model('Subscription',subscriptionschema)