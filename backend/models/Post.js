const mongoose = require('mongoose');
const Postschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    text: {
        type:String,
        required:true
    },
    likes: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'profile'
            }
        }
    ],
    comments: [{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'profile'
        },
        text:{
        type: String,
        required:true
    },
    likes: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'profile'
            }
        }
    ],
    date: {
        type:Date,
        default: Date.now
    },
    
}],
date: {
    type:Date,
    default: Date.now
},type: {
    type:String,
    default: 'text'
}
});
module.exports = Post = mongoose.model('post',Postschema);