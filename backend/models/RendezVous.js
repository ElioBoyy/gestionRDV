const mongoose = require('mongoose');
const Etats = Object.freeze({
    Free: 'free',
    Occupiet: 'occupiet',
    Confirmed: 'confirmed',
  });
const RendezVousSchema = mongoose.Schema({
    professionel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    startDate:{
        type: Date
    },
    endDate:{
        type: Date
    },
    etat:{
        type: String,
        enum: Object.values(Etats),
    },
    typeRendezVous:{
        type: String
    },
    description:{
        type: String
    },
    prix:{
        type: Number
    },
    idevent:{
        type: mongoose.Types.ObjectId
    },
    FichierJoint:{
        type: String
    }
});
Object.assign(RendezVousSchema.statics, {
    Etats,
  });

module.exports = RendezVous = mongoose.model('RendezVous',RendezVousSchema);