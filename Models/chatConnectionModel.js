
const mongoose = require('mongoose')

const  newconectionchat= new mongoose.Schema({
    fromId:{
        type:String,
        ref:'Users',
    },
    toId:{
        type:String,
        ref:'Users',
    },
     lastmessage:{
     type:String
   },
   vehicleId:{
    type:String,
    ref:'vehicles'
   }

},{
    timestamps:true
})

module.exports = mongoose.model('chatconnection',newconectionchat)