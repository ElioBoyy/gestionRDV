const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    address:{
        gouvernerat:{
            type: String
        },
        ville : {
            type: String
        },
        cite : {
            type: String
        }
    },
   
    telephone:{
        mobile : {
            type: [String],
            required: true
        },
        fix: {
            type: [String]
        }
    }, 
    
    diplome: {
        type: [String]
    },
    imageDiplome: {
        type: String

    },
    rating: {
        type: Number,
    },
    domainePrincipal: {
        type: String,
        

    },
    domaineSecondaires: {
        type: [String],
    },
    abonnes: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref:'profile'
    }],
    social: {
        youtube: {
            type:String
        },
        twitter: {
            type:String
        },
        facebook: {
            type:String
        },
        linkedin: {
            type:String
        },
        instagram: {
            type:String
        }
    },
    date:{
        type:Date,
        default: Date.now
    },
    CV: {
        type:String
    },
    description :{
        type: String
    },
    metier: {
        type: String
    },
    tags: {
        type: [String]
    },
    avatar: {
        type: String
    },
    available:[{
        startDate:{
            type: Date
        },
        endDate:{
            type: Date
        }
    }],
    prixPCR:{
        type: Number
    },
    video:{
        type: String
    },
    reviews:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'profile'
        },
        description: {
            type:String,
            required:true
        },
        comments: [{
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'profile'
            },
            text:{
            type: String,
            required:true
        },
        date: {
            type:Date,
            default: Date.now
        },
        }],
        date: {
            type:Date,
            default: Date.now
        },
        type: {
            type:String,}
        }],
        nbyes:{
            type:Number
        }
        ,
        nbno:{
            type:Number
        }
});
ProfileSchema.statics.getUserByEmail = function(email, callback) {
    let query = {user:{email : email}};
    User.findOne(query, callback);
  }
module.exports = Profile = mongoose.model('profile',ProfileSchema);