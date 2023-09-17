
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const vehicle = require('../Models/vehicleModel')
const chatcon = require('../Models/chatConnectionModel')
const subscription = require('../Models/subscriptionModel')
const dotenv=require('dotenv')

dotenv.config()

const securePassword = async (password) => {

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}


let passemail

const userRegisterpost = async (req, res) => {


    try {

        if (req.body.user.email) {

            const email = req.body.user.email
            const data= await User.findOne({email:email})
            if (data) {
                passemail=email
                sendmail(email)
                return res.send({
                    message: 'otp send to your email'
                })
            }else{
                res.status(400).send({
                    message:'please correct your email'
                })
            }
          
        } else {
            const name = req.body.user.name
            const email = req.body.user.emailuser
            const phone = req.body.user.phone
            const password = req.body.user.password

            const hashedPassword = await securePassword(password)

            const userdata = await User.findOne({ email: email })
            if (userdata) {

                return res.status(400).send({
                    message: "Email is already exist"
                })
            } else {
                const user = new User({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashedPassword
                })

                const userdata = await user.save()

                const token = jwt.sign({ _id:userdata._id}, "usersecret")
                const message='register success'
                sendmail(email)

                return res.send({token:token,message:message})

            }
        }

    } catch (error) {
        console.log(error.message);
    }

}


const userPurpose = async (req, res) => {

    try {

        const purpose = req.body.data.purpose
        
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        if (!claims) {
            return res.status(401).send({
                message: "unauthenticated"
            })
        }
        if (purpose=='customer') {
          const update = await User.updateOne({ _id: claims._id }, { $set: { purpose: purpose } })
          if (update) {
              res.send({ message: 'success' })
  
          } else {
              return res.status(400).send({
                  message: "somthing wrong..!"
              })
          }
  
            
        }else{
            const update = await User.updateOne({ _id: claims._id }, { $set: { purpose: purpose ,admin_verify:false} })
            if (update) {
                res.send({ message: 'success' })
    
            } else {
                return res.status(400).send({
                    message: "somthing wrong..!"
                })
            }
    
        }
       
    } catch (error) {
        console.log(error.message);
    }
}


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


function sendmail(email) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:process.env.user,
            pass:process.env.pass
        }
    });
    const otp = generateOTP()
    ogotp = otp
    const mailOptions = {
        from: process.env.user,
        to: email,
        subject: 'Your OTP code',
        text: `Your OTP is ${otp}.`
    };


    console.log(otp + 'this you otp');

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {

            console.log(`Email sent: ${info.response}`);
        }
    });
}

const postotp = async (req, res) => {
    try {

        if (req.body.otp.otppass) {

            const userotp = req.body.otp.otppass
            if (userotp == ogotp) {
                return res.send({
                    message: 'verification success'
                })
            } else {
                return res.status(400).send({
                    message: 'otp is wrong'
                })
            }

        } else {
            const userotp = req.body.otp.otp

            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                return res.status(401).send({ message: 'Access denied. No token provided.' })
            }
    
            const claims = jwt.verify(token,'usersecret')

            if (userotp == ogotp) {
              const update=  await User.updateOne({ _id: claims._id }, { $set: { is_verified: true } })
                if (update) {
                    return res.send({
                        message: 'verification success'
                    })
                }else{
                    return res.status(400).send({
                        message: 'verification failed..!'
                    })
                }
               
            } else {
                return res.status(400).send({
                    message: 'otp is wrong'
                })
            }
        }


    } catch (error) {
        console.log(error.message);
    }
}


const loginuser = async (req, res) => {
    try {
        const data = req.body.data.email
        const password = req.body.data.password
        const userdata = await User.findOne({ email: data })

        if (userdata) {
            if (userdata.is_verified) {

                if (!userdata.is_block) {
                    const passwordmatch = await bcrypt.compare(password, userdata.password)
                    if (passwordmatch) {



                        const token = jwt.sign({ _id:userdata._id},"usersecret")

                        const message='login success'
                       return res.send({token:token,message:message})
               
                    } else {
                        res.status(400).send({
                            message: 'password is incorrect'
                        })
                    }


                } else {
                    res.status(400).send({
                        message: ' you are blocked admin'
                    })

                }

            } else {
                res.status(400).send({
                    message: 'user not verified'
                })
            }
        } else {
            res.status(400).send({
                message: 'email is incorrect'
            })
        }
    } catch (error) {
        console.log(error.message);
        }


    
}

const setpassword = async (req, res) => {
    try {

       
        

        const password = req.body.data.password
        const hashedPassword = await securePassword(password)
        const updatapass = await User.updateOne({ email:passemail }, { $set: { password: hashedPassword } })
        if (updatapass) {
            res.send({
                message: 'password changed'
            })
        } else {
            res.status(400).send({
                message: 'somthing wrong..!'
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const gethome = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        if (claims) {
            const vehicledata = await vehicle.find({is_block:false,status:'active'})
            if (vehicledata) {

                res.send(vehicledata)
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

const serviceget= async(req,res)=>{

    try {

       const datas= await User.find({is_block:false,purpose:'service'})
       if (datas) {
        res.send({datas:datas})
       }else{
        res.status.send({message:'somthing went wrong...!'})
       }
            
    } catch (error) {
        console.log(error.message);
    }
}

const businessget= async(req,res)=>{

    try {

       const datas= await User.find({is_block:false,purpose:'business'})
       if (datas) {
        res.send({datas:datas})
       }else{
        res.status.send({message:'somthing went wrong...!'})
       }
            
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    userRegisterpost,
    userPurpose,
    postotp,
    loginuser,
    setpassword,
    gethome,
    serviceget,
    businessget,

}
