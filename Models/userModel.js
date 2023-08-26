const mongoose = require('mongoose')

const userSCheema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    purpose:{
        type:String,
        default:'customer'
    },
    image:{
        type:String,
        default:''
    },
    connections:{
        type:Number,
        default:0
    },
    post:{
        type:Number,
        default:0
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    is_admin:{
        type:Boolean,
        default:false
    },
    is_block:{
        type:Boolean,
        default:false
    },
    

})

module.exports= mongoose.model('Users',userSCheema)
