const jwt = require('jsonwebtoken');
const User = require('../Models/userModel')
const vehicle = require('../Models/vehicleModel')
const uuid = require('uuid');
const subscription = require('../Models/subscriptionModel')



function generateUniqueId() {
    return uuid.v4()
}


const addVehicle = async (req, res) => {
    try {

        const imageFile = req.files['image'][0];
        const proofFile = req.files['proof'][0];

        const name = req.body.name
        const rentAmount = req.body.rentamount
        console.log(rentAmount);
        const type = req.body.type
        const place = req.body.place
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }

        const claims = jwt.verify(token, 'usersecret')
       

        const userdata = await User.findOne({ _id: claims._id })

        if (userdata) {

            const uniqueId = generateUniqueId();
            const vehicledata = new vehicle({

                ownerId: claims._id,
                ownername: userdata.name,
                name: name,
                rentAmount: rentAmount,
                type: type,
                place: place,
                proof: proofFile.filename,
                image: imageFile.filename


            })

            const resulte = await vehicledata.save()
            if (resulte) {
                await User.updateOne({ _id: claims._id }, { $inc: { post: 1 } });
                res.send({
                    message: 'vehicle adding success'
                })
            } else {
                res.status(400).send({
                    message: 'somthing wrong'
                })
            }
        }

        else {
            res.status(400).send({
                message: 'user not authenicated'
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}


const vehiclelist = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' })
        }


        const vehicledata = await vehicle.find({})
        if (vehicledata) {
            res.send({
                datas: vehicledata
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


const vehicleactions= async (req,res)=>{

    try {
        const id = req.body.id

        const userdata= await vehicle.findOne({_id:id})
        if (!userdata.is_block) {
            const updatedata= await vehicle.findByIdAndUpdate({_id:id},{$set:{is_block:true}})
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
            const updatedata= await vehicle.findByIdAndUpdate({_id:id},{$set:{is_block:false}})
            if (updatedata) {

                res.send({
                    success:' unblocked'
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


const editvehicleget=async(req,res)=>{
    try {
        const id=req.body.id
        const vehicledata= await vehicle.findOne({_id:id})
        if (vehicledata) {
            res.send({
                data:vehicledata
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


const editvehicle=async (req,res)=>{
    try {
        const imageFile = req.files['image'][0];
        const proofFile = req.files['proof'][0];
        
        const id=req.body.id
        const name = req.body.name
        const rentAmount = req.body.rentamount
        const type = req.body.type
        const place = req.body.place
       

       
        if (id) {
            const updatadata=await vehicle.updateOne({_id:id},{$set:{name:name,rentAmount:rentAmount,type:type,proof:proofFile.filename,image:imageFile.filename}})
            if (updatadata) {
                res.send({
                    message:'vehicle updated'
                })
                
            }else{
                res.status(400).send({
                    message:'somthing wrong...!'
                })
            }
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}


const removevehicle=async(req,res)=>{
    try {
        const id=req.body.id
        const vehicledata= await vehicle.findOneAndDelete({_id:id})
        if (vehicledata) {
            await User.updateOne({ _id:vehicledata.ownerId }, { $inc: { post: -1 } });
            res.send({
                message:'your vehicle deleted'
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

const singleview = async(req,res)=>{
    const id = req.body.id
    const token = req.header('Authorization')?.split(' ')[1];
    const claims= jwt.verify(token,'usersecret')
    let count=0
    const currdata= await User.findOne({_id:claims._id})
    
    const viewcheck=await vehicle.findOne({_id:id})
    if (id) {

        if (viewcheck.views.length==0) {
             await vehicle.updateOne({_id:id},{$push:{views:claims._id}})

        }else{
            for (let i = 0; i < viewcheck.views.length; i++) {

                if (viewcheck.views[i]==claims._id) {
                  count++
                }
            }

            if (count==0) {
                await vehicle.updateOne({_id:id},{$push:{views:claims._id}})      
            }

        }

        

        const data=await vehicle.findOne({_id:id})
        const usdata= await User.findOne({_id:data.ownerId})

        if (data) {
        
            res.send({data:data,userdata:usdata,currdata:currdata})
            
        }else{
            res.status(400).send({
                message:'sonthing went wrong...!'
            })
        }
    }else{
        res.status(400).send({
            message:'sonthing went wrong...!'
        })
    }
}

const saved= async (req,res)=>{
    try {
        const id = req.body.id
        const vehidata= await vehicle.findOne({_id:id})
        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')
        const userdata= await User.findOne({_id:claims._id})
        
   
        for (let i = 0; i < userdata.saved.length; i++) {
            if (userdata.saved[i].vehicleId===id) {
             return res.status(400).send({
                 message:'this vehicle alredy saved'
             })
            }
        }

        
        if (vehidata) {
           const  update= await User.findByIdAndUpdate({_id:claims._id},{$push:{saved:{vehicleId:vehidata._id,vehiclename:vehidata.name,image:vehidata.image,place:vehidata.place,date:vehidata.date,amount:vehidata.rentAmount}}})

           if (update) {

            res.send({
                message:'saved success'
            })
            
           }else{
            res.status(400).send({
                message:'somthing wrong..!'
            })
           }
        }else{
            res.status(400).send({
                message:'somthing wrong..!'
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const getsaved=async(req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')

        const saveddata= await User.findOne({_id:claims._id})

        if (saveddata) {
            res.send({
                data:saveddata
            })
        }else{
            res.status(400).send({
                message:'somthin went wrong...!'
            })
        }
       

    } catch (error) {
        console.log(error.message);
        
    }
}

const removesaved=async (req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')

        const id= req.body.id
        const result= await User.findByIdAndUpdate({_id:claims._id},{$pull:{saved:{_id:id}}})
        if (result) {
            res.send({
                message:'removed success'
            })
        }else{
            res.status(400).send({
                message:'somthing went wrong..!'
            })
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const makechange=async(req,res)=>{
   try {

    const id= req.body.id
    const data= await vehicle.findOne({_id:id})
    if (data.status=='active') {
        const update= await vehicle.updateOne({_id:id},{$set:{status:'running'}})
        if (update) {
            res.send({
                message:'success'
            })
        }else{
            res.status(400).send({
                message:"somthing wrong..!"
            })
        }

    }else {
        const update= await vehicle.updateOne({_id:id},{$set:{status:'active'}})
        if (update) {
            res.send({
                message:'success'
            })
        }else{
            res.status(400).send({
                message:"somthing wrong..!"
            })
        }
    }
    
   } catch (error) {
    console.log(error.message);

   }
}

const sendlike= async (req,res)=>{
    try {

        const token = req.header('Authorization')?.split(' ')[1];
        const claims= jwt.verify(token,'usersecret')
        const id = req.body.id

        const data= await vehicle.findOne({_id:id})

        if (data) {
            for (let i = 0; i < data.like.length; i++) {

                if (data.like[i]==claims._id) {
                    const update= await vehicle.updateOne({_id:id},{$pull:{like:claims._id}})
                    if (update) {
                        return res.send({
                            message:'unliked'
                        })
                    }
                    
                    
                }
                
            }
            const update= await vehicle.updateOne({_id:id},{$push:{like:claims._id}})

            if (update) {
                res.send({
                    message:'liked'
                })
            }else{
                res.status(400).send({
                    message:'somthing went wrong..!'
                })
            }



        }else{
            res.status(400).send({
                message:'somthing went wrong..!'
            })
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addVehicle,
    vehiclelist,
    vehicleactions,
    editvehicleget,
    editvehicle,
    removevehicle,
    singleview,
    saved,
    getsaved,
    removesaved,
    makechange,
    sendlike
}