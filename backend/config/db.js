const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = process.env.MONGO_URI;

//console.log(db);

const connectDB = async ()=>{
    try{
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex: true,
            useFindAndModify:false
        });
        console.log('mongo connected');
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}
module.exports = connectDB;