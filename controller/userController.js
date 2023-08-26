
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const vehicle = require('../Models/vehicleModel')

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

            const email = req.body.user.email
            console.log(email + 'email');
            sendmail(email)
            return res.send({
                message: 'otp send to your email'
            })
        } else {
            console.log('erere');
            const name = req.body.user.name
            const email = req.body.user.emailuser
            const phone = req.body.user.phone
            const password = req.body.user.password

            const hashedPassword = await securePassword(password)

            const userdata = await User.findOne({ email: email })
            console.log('data  '+userdata);
            if (userdata) {
                console.log(userdata);

                return res.status(400).send({
                    message: "Email is already exist"
                })
            } else {
                console.log('ajmal');
                const user = new User({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashedPassword
                })

                const userdata = await user.save()

                const token = jwt.sign({ _id:userdata._id}, "usersecret")
                const message='register success'
                console.log(token);
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

        console.log('loot');
        const purpose = req.body.data.purpose
        console.log(purpose + 'purpose');
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        console.log(claims._id+'userID accessed');
        if (!claims) {
            return res.status(401).send({
                message: "unauthenticated"
            })
        }
        const update = await User.updateOne({ _id: claims._id }, { $set: { purpose: purpose } })
        console.log(update);
        if (update) {
            res.send({ message: 'success' })

        } else {
            return res.status(400).send({
                message: "somthing wrong..!"
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
            user: 'ajmalsabith444@gmail.com',
            pass: 'roapvammbmkxzlck'
        }
    });
    const otp = generateOTP()
    ogotp = otp
    console.log(otp);
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
            console.log(claims._id+'userID accessed');

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
        console.log(data + 'email');
        const password = req.body.data.password
        console.log(password + 'password');
        const userdata = await User.findOne({ email: data })

        if (userdata) {
            console.log(userdata + 'data');
            if (userdata.is_verified) {

                if (!userdata.is_block) {
                    const passwordmatch = await bcrypt.compare(password, userdata.password)
                    if (passwordmatch) {



                        const token = jwt.sign({ _id:userdata._id},"usersecret")

                        console.log(token)
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

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        console.log(claims._id+'userID accessed');

        const password = req.body.data.password
        const hashedPassword = await securePassword(password)
        const updatapass = await User.updateOne({ _id: claims._id }, { $set: { password: hashedPassword } })
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

const getprofile = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        console.log(claims._id+'userID accessed');
        const userdata = await User.findOne({ _id: claims._id })
        const vehicledata = await vehicle.find({ ownerId: claims._id })
        console.log(vehicledata);

        if (userdata) {
            res.send({
                userdata, vehicledata
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

const editprofileload = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        console.log(claims._id+'userID accessed');
        const userdata = await User.findOne({ _id: claims._id, is_admin: false })
        if (userdata) {
            console.log(userdata);

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
        console.log(claims._id+'userID accessed');
        const imageFile = req.file.filename
        console.log(imageFile);

        const name = req.body.name
        const phone = req.body.phone
        const place = req.body.place
        const qualification = req.body.qualification
        const aboutyou = req.body.aboutyou



        const userdata = await User.findOne({ _id: claims._id })
        if (userdata) {
            if (userdata.purpose=='service') {
                const updatedata = await User.findOneAndUpdate({ _id: claims._id }, { $set: { name: name,place:place,phone: phone, image: req.file.filename ,aboutyou:aboutyou,qualification:qualification} })
                if (updatedata) {
                    res.send({
                        message: 'profile updated success'
                    })
                } else {
                    res.status(400).send({
                        message: 'somthing wrong...!'
                    })
                }
            }else{
                const updatedata = await User.findOneAndUpdate({ _id: claims._id }, { $set: { name: name,place:place,aboutyou:aboutyou, phone: phone, image: req.file.filename } })
                if (updatedata) {
                    res.send({
                        message: 'profile updated success'
                    })
                } else {
                    res.status(400).send({
                        message: 'somthing wrong...!'
                    })
                }
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

const gethome = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
        console.log(claims._id+'userID accessed');
        if (claims) {
            const vehicledata = await vehicle.find({is_block:false})
            if (vehicledata) {

                console.log(vehicledata);
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
    getprofile,
    editprofileload,
    editprofile,
    gethome,
    serviceget,
    businessget
    

}
