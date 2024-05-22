const mongoose = require('mongoose');

const DevisSchema = mongoose.Schema({
    professionel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
    appointment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'RendezVous'
    },
    prixAvantTva:{
        type: Number
    },
    Tva:{
        type: Number
    },
    prixFinal:{
       type: Number
    }
});
module.exports = Devis = mongoose.model('Devis',DevisSchema);