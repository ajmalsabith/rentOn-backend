const express = require('express');
const mongoose = require('mongoose');
const userroutes = require('./routes/userRouter');
const adminRoutes = require('./routes/adminRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const intializeSocket = require('./socket.io/socket.io')

const app = express();
const http = require('http').createServer(app)
const dotenv= require('dotenv')
dotenv.config()



app.use(cors({
    credentials:true,
    origin:[process.env.origin]
}))

// app.use(cors('*'));
app.use(cookieParser());
app.use(express.json());

app.use('/api',userroutes);
app.use('/api/admin',adminRoutes);

app.use('/public', express.static('./public/vehicleimg'));

mongoose.connect(process.env.mongodb,{
    useNewUrlParser: true
}).then(()=>{
    console.log('Database connected successfully');
})
 const server=http.listen(5000,()=>{
    console.log('App is listening on port 5000');
})

intializeSocket(server)
