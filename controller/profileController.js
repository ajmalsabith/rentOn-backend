


const User = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const vehicle = require('../Models/vehicleModel')
const chatcon = require('../Models/chatConnectionModel')
const subscription = require('../Models/subscriptionModel')
const dotenv=require('dotenv')

dotenv.config()







const getprofile = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        

        const claims = jwt.verify(token, 'usersecret')
        const connection= await chatcon.find({ $or: [{ fromId: claims._id }, { toId: claims._id }] }).count()

        const userdata = await User.findOne({ _id: claims._id })
        const subdata = await subscription.findOne({userId: claims._id })
        const vehicledata = await vehicle.find({ ownerId: claims._id })

        if (userdata) {
            res.send({
                userdata, vehicledata,subdata,connection
            })
        } else {
            res.status(400).send({
                message: 'somthing went wrong..!'
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const editprofileload = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        const userdata = await User.findOne({ _id: claims._id, is_admin: false })
        if (userdata) {

            res.send(userdata)
        }

    } catch (error) {
        console.log(error.message);
    }
}

const editprofile = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }



        const claims = jwt.verify(token, 'usersecret')
        const imageFile = req.file.filename

        const name = req.body.name
        const phone = req.body.phone
        const place = req.body.place
        const qualification = req.body.qualification
        const aboutyou = req.body.aboutyou



        const userdata = await User.findOne({ _id: claims._id })
        if (userdata) {
                    const updatedata = await User.findOneAndUpdate({ _id: claims._id }, { $set: { name: name,place:place,phone: phone, image: req.file.filename ,aboutyou:aboutyou,qualification:qualification} })
                    if (updatedata) {
                        res.send({
                            message: 'profile updation success'
                        })
                    } else {
                        res.status(400).send({
                            message: 'somthing wrong...!'
                        })
                    }
                   
            
           
        } else {
            res.status(400).send({
                message: 'somthing wrong...!'
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}




const viewprofile=async (req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims = jwt.verify(token, 'usersecret')
        const connection= await chatcon.find({ $or: [{ fromId: claims._id }, { toId: claims._id }] }).count()

        const currentuser= await User.findOne({_id:claims._id})
        const id = req.body.id
        const userdata = await User.findOne({ _id:id})
        const vehicledata = await vehicle.find({ ownerId:id})
        const sub = await subscription.findOne({userId: id })

        if (userdata) {
            res.send({
                userdata, vehicledata,sub,currentuser,connection
            })
        } else {
            res.status(400).send({
                message: 'somthing wrong...!'
            })
        }

    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    getprofile,
    editprofile,
    editprofileload,
    viewprofile
}