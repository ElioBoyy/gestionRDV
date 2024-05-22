const mongoose = require('mongoose');
const Etats = Object.freeze({
    Read: 'read',
    Unread: 'unread'
  });
const NotificationSchema = mongoose.Schema({
    professionel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    reciever:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    RendezVous:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'RendezVous'
    },
    etat:{
        type:String,
    },
    title:{
        type:String,
    },
    date:{
        type:Date,
        default: Date.now
    }
    
});
Object.assign(NotificationSchema.statics, {
    Etats,
  });

module.exports = Notification = mongoose.model('Notification',NotificationSchema);