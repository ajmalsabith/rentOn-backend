const vehicle = require('../Models/vehicleModel')
const subscription = require('../Models/subscriptionModel')
const User = require('../Models/userModel')
const createchat = require('../Models/chatConnectionModel')
const message = require('../Models/messageModel')
const jwt= require('jsonwebtoken')

const newcreatechat= async(req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')
        const id=req.body.id
        const todata= await User.findOne({_id:id,})
        const fromdata= await User.findOne({_id:claims._id})

        const existdata= await createchat.findOne({fromId:claims._id,toId:id})
        const existdataseconde= await createchat.findOne({fromId:id,toId:claims._id})



        if (id!==claims._id) {
            if (existdata||existdataseconde) {
                res.send({
                    message:'alredy done this'
                })
            }else{
                if (id) {
                    const newconnection= new createchat({
                        fromId:claims._id,
                        toId:id
                        
                    })
    
                    
        
                  const result =await newconnection.save()
                  console.log(result);
                    if (result) {
                        res.send({

                            message:'success'

                        })
                    }else{
                        res.status(400).send({
                            message: "somthing wrong..!"
                        })
                    }
                }else{
                    res.status(400).send({
                        message: "somthing wrong..!"
                    })
                }
            }
           
        }else{  
                res.status(400).send({
                    message: "this is your id"
                })
            
        }
       
    } catch (error) {
        console.log(error.message);
    }
}



const getchatdata= async (req,res)=>{
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')

        const connctiondata = await createchat
        .find({ $or: [{ fromId: claims._id }, { toId: claims._id }] })
        .populate('fromId').populate('toId')

        const curr= await User.findOne({_id:claims._id})
        
        console.log(connctiondata);

        if (connctiondata) {
            res.send({
                data:connctiondata,curr:curr
            })
        }else{
            res.status(400).send({
                message:"somthing went wrong..!"
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const sendmessage=async (req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')


        const data= req.body.data
        if (data) {
            const newmessage= new message({
                connectionId:id,
                from:claims._id,
                to:id,
                message:data.message
            })
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const getmessage= async (req,res)=>{
    try {

        const idobj= req.body.data
        console.log(idobj);
        const condata= await createchat.findOne({_id:idobj.conId}).populate('fromId').populate('toId')
        if (condata) {
            res.send({
                condata:condata
            })

        }
        
    } catch (error) {
        console.log(error.message);
        
    }
} 

module.exports={
    newcreatechat,
    getchatdata,
    getmessage
}