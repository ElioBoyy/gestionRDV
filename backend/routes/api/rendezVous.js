const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const moment = require('moment');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');
const RendezVous = require('../../models/RendezVous');
const { Etats } = require('../../models/RendezVous');
const nodemailer = require('nodemailer');
const mailer = require('../../misc/mailer');
const Devis = require('../../models/Devis');
const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
router.get(
  '/getById/:id',
  auth,
  async (req, res) => {
    const errors = {};
   await RendezVous.findOne({ _id: req.params.id})
    .populate({
      path: "professionel", // populate blogs
      populate: {
         path: "user" // in blogs, populate comments
      }
   }).populate({
    path: "patient", // populate blogs
    populate: {
       path: "user" // in blogs, populate comments
    }
 })
      .then(rendezVous => {
        if (!rendezVous) {
          errors.norendezVous = 'There is no Rendez vous for this user';
          return res.status(404).json(errors);
        }
        res.json(rendezVous);
      })
      .catch(err => res.status(404).json(err));
 
    }
  
);
router.get(
    '/mesRendezVous/:id',
    auth,
    async (req, res) => {
      const errors = {};
      await Profile.findOne({ user: req.params.id })
      .populate('user', ['firstName', 'lastName','birthDate','sexe'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
      RendezVous.find({ professionel: profile._id})
      .populate({
        path: "professionel", // populate blogs
        populate: {
           path: "user" // in blogs, populate comments
        }
     }).populate({
      path: "patient", // populate blogs
      populate: {
         path: "user" // in blogs, populate comments
      }
   })
        .then(rendezVous => {
          if (!rendezVous) {
            errors.norendezVous = 'There is no Rendez vous for this user';
            return res.status(404).json(errors);
          }
          res.json(rendezVous);
        })
        .catch(err => res.status(404).json(err));
   
      });
    }
  );
router.get(
    '/rendezvous/:id',
   
    (req, res) => {
      const errors = {};
  
      RendezVous.find({ patient: req.params.id })
      .populate({
        path: "patient", // populate blogs
        populate: {
           path: "user" // in blogs, populate comments
        }
     }).populate({
      path: "professionel", // populate blogs
      populate: {
         path: "user" // in blogs, populate comments
      }
   })
        .then(rendezVous => {
          if (!rendezVous) {
            errors.norendezVous = 'There is no Rendez vous for this user';
            return res.status(404).json(errors);
          }
          res.json(rendezVous);
        })
        .catch(err => res.status(404).json(err));
    }
  );

router.post(
    '/',
   
    async (req, res) => {    
      let filepost=null;
    //const file = req.files.file;
      console.log(req.files.file)
    if(req.files.file){
      let filename = Date.now()+'-'+req.files.file.name;
      req.files.file.mv('public/images/rdv/'+filename)
      filepost='public/images/rdv/'+filename;

    }
      const rendezVousFields = {};

      if (req.body.pro) rendezVousFields.professionel = req.body.pro;
      if (req.body.patient) rendezVousFields.patient =req.body.patient;
      if (req.body.startDate) rendezVousFields.startDate = req.body.startDate;
      if (req.body.endDate) rendezVousFields.endDate = req.body.endDate;
      if (req.body.id) rendezVousFields.idevent = req.body.id;
      rendezVousFields.FichierJoint = filepost;
      if (req.body.typeRendezVous) rendezVousFields.typeRendezVous = req.body.typeRendezVous;
      if (req.body.description) rendezVousFields.description = req.body.description;
      rendezVousFields.etat = Etats.Free; 
      if (req.body.prix)rendezVousFields.prix = req.body.prix;
      let professionel = await Profile.findOne({_id: req.body.pro}).populate('user');
      const html = `salut ${professionel.user.firstName}, 
      <br/>
      Vous avez un nouveau ${req.body.typeRendezVous} rendez-vous à ${req.body.startDate}
      <br/>
      Pour plus d'informations, veuillez consulter votre calendrier  .`;
      
      
    await mailer.sendMail('labes.assitance@gmail.com', professionel.user.email, 'New appointment', html)

  new RendezVous(rendezVousFields).save().then(rendezVous => res.json(rendezVous));   
        
    }
  );
  router.put(
    '/:id',
   
    async (req, res) => {    
      const rendezVousFields = {};

      if (req.body.pro) rendezVousFields.professionel = req.body.pro;
      if (req.body.patient) rendezVousFields.patient =req.body.patient;
      if (req.body.startDate) rendezVousFields.startDate = req.body.startDate;
      if (req.body.endDate) rendezVousFields.endDate = req.body.endDate;
      if (req.body.typeRendezVous) rendezVousFields.typeRendezVous = req.body.typeRendezVous;
      if (req.body.description) rendezVousFields.description = req.body.description;
      rendezVousFields.etat = Etats.Free; 
      rendezVousFields.prix = 0;
     
      let RDV = await RendezVous.findOne({_id: req.params.id});
        if (RDV) {
          RDV = await RendezVous.findOneAndUpdate({
                _id: req.params.id
            }, {
                $set: rendezVousFields
            }, {new: true});
            return res.json(RDV);
        }   
        
    }
  );
  // @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
    '/:id',
  
    async (req, res) => {
        try {
            const RDV = await RendezVous.findOne({_id: req.params.id});
            if (! RDV) {
                return res.status(400).json({msg: 'There is no rendezvous'});
            }
            await RendezVous.remove(RDV);
            const RDVs = await RendezVous.find();
    
            res.json(RDVs);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    }
  );
   // @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.put(
    '/changeEtat/:id',
   
    async (req, res) => {
        try {
            const {etat} = req.body;
            let rdv=await RendezVous.findOne({ _id: req.params.id })
            .populate({
              path: "patient", // populate blogs
              populate: {
                 path: "user" // in blogs, populate comments
              }
           }).populate({
            path: "professionel", // populate blogs
            populate: {
               path: "user" // in blogs, populate comments
            }
         })
         console.log(rdv)
            if(etat === Etats.Confirmed){
              const html = `salut  ${rdv.patient.user.firstName}, 
      <br/>
      Le ${rdv.typeRendezVous} rendez-vous à ${rdv.startDate} est confirmé.
      <br/>
      Le téléphone du ${rdv.professionel.metier} est: ${rdv.professionel.telephone.mobile}
      <br/>
      Pour plus d'informations, veuillez consulter l'application .`;
      
      const html1 = `salut ${rdv.professionel.user.firstName}, 
      <br/>
      Le ${rdv.typeRendezVous} rendez-vous à ${rdv.startDate} est confirmé par le patient .
      <br/>
      Le téléphone du patient est: ${rdv.patient.telephone.mobile}
      <br/>
      Pour plus d'informations, veuillez consulter l'application .`;
    await mailer.sendMail('labes.assitance@gmail.com', rdv.patient.user.email, 'Confirmed appointment', html)
    await mailer.sendMail('labes.assitance@gmail.com', rdv.professionel.user.email, 'Confirmed appointment', html1)

            }
            else {
             const devis = await Devis.findOne({appointment : rdv._id })
      .populate({
        path: "appointment", 
        populate: {
           path: "professionel",
           populate:{
            path: "user"
           } 
        }
     }).populate({
      path: "appointment", 
      populate: {
        path: "patient",
        populate:{
          path: "user" 
        }
      }
   })
              const html1 = `salut  ${rdv.patient.user.firstName}, 
      <br/>
      Le ${rdv.typeRendezVous} rendez-vous à ${rdv.startDate} est traité par the ${rdv.professionel.metier}.
      <br/>
      Le prix du rendez-vous est  : ${devis.prixFinal} DT
      <br/>
      Pour plus d'informations, veuillez consulter l'application .`;
    await mailer.sendMail('labes.assitance@gmail.com', rdv.patient.user.email, 'Traited appointment', html1)
            }
            const RDV = await RendezVous.findOneAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    etat: etat
                }
            });
            if(!RDV)
            {
                return res.status(400).json({msg:'There is no rendezvous'});
            }
            const RDVs = await  RendezVous.find({ professionel: rdv.professionel})
            .populate({
              path: "professionel", // populate blogs
              populate: {
                 path: "user" // in blogs, populate comments
              }
           }).populate({
            path: "patient", // populate blogs
            populate: {
               path: "user" // in blogs, populate comments
            }
         });
    
            res.json(RDVs);
        
    
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    }
  );
  router.get(
    '/byEtat/:etat',
    (req, res) => {
      const errors = {};
      RendezVous.find({ etat: req.params.etat })
      .populate({
        path: "professionel", // populate blogs
        populate: {
           path: "user" // in blogs, populate comments
        }
     }).populate({
      path: "patient", // populate blogs
      populate: {
         path: "user" // in blogs, populate comments
      }
   })
        .then(rendezVous => {
          if (!rendezVous) {
            errors.norendezVous = 'There is no Rendez vous ';
            return res.status(404).json(errors);
          }
          res.json(rendezVous);
        })
        .catch(err => res.status(404).json(err));
    }
  );
  router.post(
    '/Adddevis',
    async (req, res) => {
      const errors = {};
      const {idAp,prixAvant,Tva,prixFinal} = req.body;
      const devisFields = {};
      if (idAp) devisFields.appointment = idAp;
      if (prixAvant) devisFields.prixAvantTva =prixAvant;
      if (Tva) devisFields.Tva = Tva;
      if (prixFinal) devisFields.prixFinal = prixFinal;
      const RDV = await RendezVous.findOneAndUpdate({
        _id: idAp
    }, {
        $set: {
            prix: prixFinal
        }
    });
    if(!RDV)
    {
        return res.status(400).json({msg:'There is no rendezvous'});
    }
      const rdv = await RendezVous.findOne({_id:idAp});
      devisFields.professionel = rdv.professionel;
      devisFields.patient = rdv.patient;
      new Devis(devisFields).save().then(devis => res.json(devis));   
    }
  );
  router.get(
    '/getDevis/:id',
    async (req, res) => {
      const errors = {};
      await Profile.findOne({ user: req.params.id })
      .populate('user', ['firstName', 'lastName','birthDate','sexe'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
        Devis.find({ professionnel: profile._id})
        .populate({
          path: "RendezVous",
       }).populate({
        path: "professionel", 
        populate: {
          path: "user",
        }
     })
     .populate({
      path: "patient", 
      populate: {
        path: "user",
      }
   })
        .then(devis => {
          if (!devis) {
            errors.devis = 'There is no devis for this user';
            return res.status(404).json(errors);
          }
          res.json(devis);
        })
        .catch(err => res.status(404).json(err));
   
      });
    }
  );
  router.get(
    '/getDevisPatient/:id',
    async (req, res) => {
      const errors = {};
      await Profile.findOne({ user: req.params.id })
      .populate('user', ['firstName', 'lastName','birthDate','sexe'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
        Devis.find({ patient: profile._id})
        .populate({
          path: "RendezVous",
       }).populate({
        path: "professionel", 
        populate: {
          path: "user",
        }
     })
     .populate({
      path: "patient", 
      populate: {
        path: "user",
      }
   })
        .then(devis => {
          if (!devis) {
            errors.devis = 'There is no devis for this user';
            return res.status(404).json(errors);
          }
          res.json(devis);
        })
        .catch(err => res.status(404).json(err));
   
      });
    }
  );
  router.get(
    '/getDevisByRendezVous/:id',
    async (req, res) => {
      const errors = {};
     
        await Devis.findOne({ appointment: req.params.id})
        .populate({
          path: "appointment",
       }).populate({
        path: "professionel", 
        populate: {
          path: "user",
        }
     })
     .populate({
      path: "patient", 
      populate: {
        path: "user",
      }
   })
   .then(devis => {
    if (!devis) {
      errors.devis = 'There is no devis for this user';
      return res.status(404).json(errors);
    }
    res.json(devis);
  })
  .catch(err => res.status(404).json(err));

    }
    
  );
  router.get('/lastWeekstat/:id',auth,async (req, res) => {
    const startOfLastWeek = +moment().subtract(1, 'weeks').utcOffset(1).startOf('week').utcOffset(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    const endOfLastWeek = +moment().subtract(1, 'weeks').utcOffset(1).endOf('week').utcOffset(1).hours(23).minutes(59).seconds(59).milliseconds(99);
    console.log(startOfLastWeek)
    console.log(endOfLastWeek)

    const rendezVous = await RendezVous.find({
        professionel: req.params.id,
        startDate: {
            $gte: startOfLastWeek,
            $lte: endOfLastWeek
        }
    });
    res.json(rendezVous)
  });
  module.exports = router;