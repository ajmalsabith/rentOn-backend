
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const securePassword = async (password) => {

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}

const userRegisterpost = async (req, res) => {


    try {

        if (req.body.user.email) {

            // otp send to email for forget password
            const email=req.body.user.email
            console.log(email+'email');
            sendmail(email)
           return res.send({
                message:'otp send to your email'
            })
        }else{
            console.log('erere');
            const name = req.body.user.name
            const dob = req.body.user.dob.toString(10)
            const email = req.body.user.emailuser
            const phone = req.body.user.phone
            const password = req.body.user.password
    
            const hashedPassword = await securePassword(password)
    
            const userdata = await User.findOne({ email: email })
            if (userdata) {
                console.log(userdata);
    
                return res.status(400).send({
                    message: "Email is already exist"
                })
            } else {
                console.log('ajmal');
                const user = new User({
                    name: name,
                    dateOfBirth: dob,
                    email: email,
                    phone: phone,
                    password: hashedPassword
                })
    
                const userdata = await user.save()
    
                const {_id} = await userdata.toJSON();
                console.log(_id);
                const token = jwt.sign({_id:_id},"superscret");
        
                res.cookie("jwt",token,{
                    httpOnly:true,
                    maxAge:24*60*60*1000
                })
        
    
                sendmail(email)
    
                return res.send({ message: "register success" })
    
            }
        }
       
    } catch (error) {
        console.log(error.message);
    }

}

const userget = (req, res) => {
    try {
        console.log('user set');
        const cookie = req.cookies["jwt"];
        
        if (!cookie) {
            console.log('no cookie');
            return res.status(400).send({
                message: 'Unauthenticated..!'
            });
        }
        
        const secretKey = "superscret"; // Replace with your actual secret key
        const claims = jwt.verify(cookie, secretKey);
        
        console.log(claims._id + ' userId is');
        
        // Your code for further processing authenticated users
        
    } catch (error) {
        console.log(error.message);
        return res.status(401).send({
            message: 'Invalid token'
        });
    }
}


const userPurpose = async (req, res) => {

    try {
       
        console.log('loot');
        const purpose=req.body.data.purpose
        console.log(purpose+'purpose');
        const cookie = req.cookies["jwt"];
        const claims = jwt.verify(cookie,"superscret")
        console.log(claims._id+'userID');
        if(!claims){
            return res.status(401).send({
                message:"unauthenticated"
            })
        }
       const update= await User.updateOne({_id:claims._id},{$set:{purpose:purpose}})
       console.log(update);
       if (update) {
        res.send({message:'success'})

       }else{
        return res.status(400).send({
            message:"somthing wrong..!"
        })
       }
      
    } catch (error) {
        console.log(error.message);
    }
}


 function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let ogotp

function sendmail(email) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:'ajmalsabith444@gmail.com',
            pass:'roapvammbmkxzlck'
        }
    });
   const otp= generateOTP()
   ogotp=otp
    const mailOptions = {
        from: process.env.user,
        to: email,
        subject: 'Your OTP code',
        text: `Your OTP is ${otp}.`
    };
    

    console.log(otp+'this you otp');

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {

            console.log(`Email sent: ${info.response}`);
        }
    });
}

const postotp=async (req,res)=>{
    try {

        if (req.body.otp.otppass) {

            const userotp=req.body.otp.otppass
            if(userotp==ogotp){
               return res.send({
                    message:'verification success'
                })
            }else{
               return res.status(400).send({
                message:'otp is wrong'
               }) 
            }

        }else{
            const userotp= req.body.otp.otp

            const cookie=req.cookies['jwt']
            const claims=jwt.verify(cookie,"superscret")
    
            console.log(ogotp);
            if(userotp==ogotp){
                await User.updateOne({_id:claims._id},{$set:{is_verified:true}})
               return res.send({
                    message:'verification success'
                })
            }else{
               return res.status(400).send({
                message:'otp is wrong'
               }) 
            }
        }
      

    } catch (error) {
        console.log(error.message);
    }
}


const loginuser= async (req,res)=>{
    try {
        const data=req.body.data.email
        console.log(data+'email');
        const password= req.body.data.password
        console.log(password+'password');
        const userdata= await User.findOne({email:data})

        if (userdata) {
            console.log(userdata+'data');
            if (userdata.is_verified) {
                const passwordmatch = await bcrypt.compare(password, userdata.password)
                if (passwordmatch) {

                    const token = jwt.sign({_id:userdata._id},"superscret");

                    res.cookie("jwt",token,{
                        httpOnly:true,
                        maxAge:24*60*60*1000
                    })
                    res.send({
                        massage:'login success'
                    })
                }else{
                    res.status(400).send({
                        message:'password is incorrect'
                    })
                }
            }else{
                res.status(400).send({
                    message:'user not verified'
                })
            }
        }else{
            res.status(400).send({
                message:'email is incorrect'
            })
        }
       
    } catch (error) {
        console.log(error.message);
    }
}

const setpassword =async (req,res)=>{
    try {
        
        const cookie= req.cookies['jwt']
        const claims= jwt.verify(cookie,'superscret')
      const password=  req.body.data.password
      const hashedPassword = await securePassword(password)
      const updatapass= await User.updateOne({_id:claims._id},{$set:{password:hashedPassword}})
      if (updatapass) {
        res.send({
            message:'password changed'
        })
      }else{
        res.status(400).send({
            message:'somthing wrong..!'
        })
      }
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    userRegisterpost,
    userPurpose,
    userget,
    postotp,
    loginuser,
    setpassword

}
