const jwt = require('jsonwebtoken');
const User = require('../Models/userModel')
const vehicle= require('../Models/vehicleModel')
const uuid = require('uuid');



function generateUniqueId() {
  return uuid.v4()
}


const addVehicle= async(req,res)=>{
    try {

        const imageFile = req.files['image'][0];
        const proofFile = req.files['proof'][0];

        const name=req.body.name
        const rentAmount=req.body.rentamount
        console.log(rentAmount);
        const type=req.body.type
        const place=req.body.place
        const cookie= req.cookies['jwt']
        const claims= jwt.verify(cookie,'superscret')
        console.log(claims._id);

        const userdata= await User.findOne({_id:claims._id})
        console.log(userdata);

        if (userdata) {
         const vehicledataa= await vehicle.findOne({ownerId:claims._id})

            if (vehicledataa) {
                const uniqueId = generateUniqueId();

                const updatedata= await vehicle.findOneAndUpdate({ownerId:claims._id},{$push:{vehicles:
                    {vehicleId:uniqueId,name:name,rentAmount:rentAmount,type:type,place:place,proof:proofFile.filename,image:imageFile.filename}
                }})

                if (updatedata) {
                    res.send({
                        message:'vehicle adding success'
                    })
                }else{
                    res.status(400).send({
                        message:'somthing wrong ...!'
                    })
                }
                
            }else{
                const uniqueId = generateUniqueId();
                const vehicledata= new vehicle({

                    ownerId:claims._id,
                    ownername:userdata.name,
                    vehicles:[{
                        name:name,
                        rentAmount:rentAmount,
                        type:type,
                        place:place,
                        proof:proofFile.filename,
                        image:imageFile.filename
                    }]
                   
                })
    
                const resulte= await vehicledata.save()
                if (resulte) {
                    res.send({
                        message:'vehicle adding success'
                    })
                }else{
                    res.status(400).send({
                        message:'somthing wrong'
                    })
                }
            }
           
        }else{
            res.status(400).send({
                message:'user not authenicated'
            })
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    addVehicle
}