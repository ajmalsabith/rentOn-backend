const mongoose=require('mongoose')
// const { Stream } = require('nodemailer/lib/xoauth2')

const vehicleSchema= new mongoose.Schema({

    ownerId:{
        type:String,
        ref:'users',
        required:true
    },
    ownername:{
        type:String,
        required:true
    },
    vehicles:[{
        name:{
            type:String,
            required:true
        },
        rentAmount:{
            type:Number,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        place:{
            type:String,
            required:true
        },
        proof:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:'active'
        },
        views:{
            type:Number,
            default:0
        },
        like:{
            type:Number,
            default:0
        },
        date:{
            type:Date,
            default:new Date().toString(10)
        }
    }]
    
    

})

module.exports= mongoose.model('vehicles',vehicleSchema)
