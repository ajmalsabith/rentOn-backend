
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

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
        console.log('erere');
        const name = req.body.user.name
        const dob = req.body.user.dob.toString(10)
        const email = req.body.user.email
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

            const {_id}= userdata.toJSON()
            const token= jwt.sign({_id:_id},'secret')

            res.cookie('jwt',token,{
                httpOnly:true,
                maxAge:24*60*60*1000
            })

            return res.send({ message: "register success" })

        }
    } catch (error) {
        console.log(error.message);
    }

}

const userget= (req,res)=>{
    try {
        console.log('user set');
       const cookie=req.cookies["jwt"]
       const claims=jwt.verify(cookie,"jwt")
       if (!claims) {
        console.log('no user');
       return res.status(400).send({
            message:'unUnthenticate..!'
        })
       }



    } catch (error) {
        console.log(error.message);
    }
}

const userPurpose = async (req, res) => {

    try {
       
        console.log('loot');
       
        res.send({message:'success'})
      
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    userRegisterpost,
    userPurpose,
    userget
}
