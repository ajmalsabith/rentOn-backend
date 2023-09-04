const mongoose = require('mongoose')


const newmessage= new mongoose.Schema({

    connectionId:{
        type:String,
        ref:'chatconnection',
        required:true
    },
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    capped: { size: 102400, max: 50 },
})

module.exports= mongoose.model('messages',newmessage)