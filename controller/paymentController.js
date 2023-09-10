
const User = require('../Models/userModel')
const vehicle = require('../Models/vehicleModel')
const subscription = require('../Models/subscriptionModel')





const showfaster=async(req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')
        const userdata= await User.findOne({_id:claims._id})
        const paymentdata= req.body.data
        const id= paymentdata.id
        const newpayment= new subscription({
            userId:claims._id,
            userName:userdata.name,
            vehicleId:id,
            purpose:userdata.purpose,
            paymentId:paymentdata.paymentId,
            subscriptionType:paymentdata.type,
            amount:paymentdata.amount,
        })

        const resulte= await newpayment.save()
        console.log(resulte);
        if (resulte) {

            await vehicle.updateOne({_id:id},{$set:{showfaster:true}})
            res.send({
                message:`your ${paymentdata.type} payment success`
            })
        }else{
            res.status(400).send({
                message:'somthing went wrong...!'
            })
        }
        
    } catch (error) {
    console.log(error.message);
        
    }
}




const subscriptiontaken =async (req,res)=>{
    try {
        
        const token = req.header('Authorization')?.split(' ')[1];
        const paymentdata= req.body.data
        console.log(paymentdata);

        const type = paymentdata.type === 'monthly' ? 30 : 365;

        const endDate = new Date(Date.now() + type * 24 * 60 * 60 * 1000)
        
        const claims= jwt.verify(token,'usersecret')
        const userdata= await User.findOne({_id:claims._id})
        if (userdata) {
            const subdata= new subscription({
                userId:claims._id,
                userName:userdata.name,
                purpose:userdata.purpose,
                paymentId:paymentdata.paymentId,
                subscriptionType:paymentdata.type,
                amount:paymentdata.amount,
                endDate:endDate
            })

            const resulte= await subdata.save()
            console.log(resulte);
            if (resulte) {
                res.send({
                    message:`your ${paymentdata.type} subscription success`
                })
            }else{
                res.status(400).send({
                    message:'somthing went wrong...!'
                })
            }
        }else{
            res.status(400).send({
                message:'somthing went wrong...!'
            })
        }
    } catch (error) {

        console.log(error.message);
    }
}



module.exports={
    showfaster,
    subscriptiontaken

}