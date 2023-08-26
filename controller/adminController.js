const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const vehicle = require('../Models/vehicleModel')
const jwt = require('jsonwebtoken');


const veryfilogin = async (req, res) => {
    try {
        const data = req.body.data.email
        const password = req.body.data.password

        const admindata = await User.findOne({ email: data })
        console.log(admindata);
        if (admindata) {

            if (admindata.is_admin == true) {
                const passwordmatch = await bcrypt.compare(password, admindata.password)
                if (passwordmatch) {

                    const token = jwt.sign({ _id: admindata._id }, "adminsecret")
                    console.log(token);
                    res.send({
                        token: token
                    })

                } else {
                    res.status(400).send({
                        message: 'password is incorrect'
                    })
                }
            } else {
                return res.status(400).send({
                    message: "you are not admin"
                })
            }

        } else {
            res.status(400).send({
                message: 'email is incorrect..!'
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}

const customerget = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }
        
        const customerdata = await User.find({ is_admin: false, purpose: 'customer' })
        if (customerdata) {
            res.send({
                datas: customerdata
            })
        } else {
            res.status(400).send({
                message: 'somthing wrong ..!'
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}


const businessget = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }
        

        const businessdata = await User.find({ is_admin: false, purpose: 'business' })
        if (businessdata) {
            res.send({
                datas: businessdata
            })
        } else {
            res.status(400).send({
                message: 'somthing wrong ..!'
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}

const serviceget = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }
        

        const servicedata = await User.find({ is_admin: false, purpose:'service'})
        if (servicedata) {
            console.log(servicedata);
            res.send({
                datas: servicedata
            })
        } else {
            res.status(400).send({
                message: 'somthing wrong ..!'
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}



const useractions=async(req,res)=>{
    try {
        const id = req.body.id
        console.log(id);

        const userdata= await User.findOne({_id:id})
        if (!userdata.is_block) {
            const updatedata= await User.findByIdAndUpdate({_id:id},{$set:{is_block:true}})
            if (updatedata) {
                res.send({
                    success:'blocked'
                })
            }else{
                res.status.send({
                    message:'somthing wrong...!'
                })
            }
        }else{
            console.log('userduud');
            const updatedata= await User.findByIdAndUpdate({_id:id},{$set:{is_block:false}})
            if (updatedata) {
                console.log(updatedata);

                res.send({
                    success:'unblocked'
                })
            }else{
                res.status.send({
                    message:'somthing wrong...!'
                })
            }
           
        }
    } catch (error) {
        console.log(error.message);
        
    }
}





module.exports = {
    veryfilogin,
    customerget,
    businessget,
    serviceget,
    useractions
}