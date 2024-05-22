const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    birthDate: {
        type: Date,
        required:true
    },
    activated:{
        type: Boolean,
        default: false,
    },
    secretToken:{
        type: String
    },
    role:{
        type:String,
        required:true
    },
    sexe: {
        type: String
    },
});
module.exports =  User = mongoose.model('user', UserSchema);