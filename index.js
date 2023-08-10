const express = require('express');
const mongoose = require('mongoose');
const userroutes = require('./routes/userRouter');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api',userroutes);

app.use('/file', express.static('file'));

mongoose.connect('mongodb://127.0.0.1:27017/rentOn-project',{
    useNewUrlParser: true
}).then(()=>{
    console.log('Database connected successfully');
})
app.listen(5000,()=>{
    console.log('App is listening on port 5000');
})