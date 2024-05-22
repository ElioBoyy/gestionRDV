const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mailer = require('../../misc/mailer');
const Notification = require('../../models/Notification');
const auth = require('../../middleware/auth');
const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
const { Etats } = require('../../models/Notification');
const RendezVous = require('../../models/RendezVous');



// @route  GET api/notification/:_id
// @desc  get Notification By Id
// @access Private
router.get('/:id', async (req, res) => {
    try {

        const notifications = await Notification.findOne({_id: req.params.id})
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
    .populate({
    path: "sender", 
    populate: {
      path: "user",
    }
    })
    .populate({
    path: "receiver", 
    populate: {
      path: "user",
    }
    })
        if (notifications) {
            return res.json(notifications);
        } else {
            return res.json({err: 'not found'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});
router.get(
  '/myNotification/:id',
  auth,
  async (req, res) => {
    const errors = {};
    await Profile.findOne({ user: req.params.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
    Notification.find({ reciever: profile._id})
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
.populate({
path: "sender", 
populate: {
  path: "user",
}
})
.populate({
path: "receiver", 
populate: {
  path: "user",
}
})
      .then(notification => {
        if (!notification) {
          errors.notification = 'There is no notif for this user';
          return res.status(404).json(errors);
        }
        res.json(notification);
      })
      .catch(err => res.status(404).json(err));
 
    });
  }
);

router.get(
    '/myNotificationPro/:id',
    auth,
    async (req, res) => {
      const errors = {};
      await Profile.findOne({ user: req.params.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
      Notification.find({ professionel: profile._id})
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
 .populate({
  path: "sender", 
  populate: {
    path: "user",
  }
})
.populate({
  path: "receiver", 
  populate: {
    path: "user",
  }
})
        .then(notification => {
          if (!notification) {
            errors.notification = 'There is no notif for this user';
            return res.status(404).json(errors);
          }
          res.json(notification);
        })
        .catch(err => res.status(404).json(err));
   
      });
    }
  );
  router.get(
    '/myNotificationPatient/:id',
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
        Notification.find({ patient: profile._id})
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
   .populate({
    path: "sender", 
    populate: {
      path: "user",
    }
  })
  .populate({
    path: "receiver", 
    populate: {
      path: "user",
    }
  })
        .then(notification => {
          if (!notification) {
            errors.notification = 'There is no notif for this user';
            return res.status(404).json(errors);
          }
          res.json(notification);
        })
        .catch(err => res.status(404).json(err));
   
      });
    }
  );

  router.post('/:id',auth, async(req,res) => {
    try{
         const {id,title,idR} = req.body;
         const notificationfield = {};
         notificationfield.etat = Etats.Unread; 
         notificationfield.RendezVous = id;
         notificationfield.title = title;
         notificationfield.reciever = idR;
         const pro = await Profile.findOne({ user: req.params.id })
         notificationfield.sender = pro._id;
         const rdv = await RendezVous.findOne({_id:req.body.id});
         notificationfield.professionel = rdv.professionel;
         notificationfield.patient = rdv.patient;
         new Notification(notificationfield).save().then(notification => res.json(notification));
         console.log(id);
     res.json(id);}
     
    catch(err){console.error(err.message);
     res.status(500).send('server message');}
 });
  
 router.get(
  '/byEtat/:etat',
  (req, res) => {
    const errors = {};
    Notification.find({ etat: req.params.etat })
    .populate({
      path: "RendezVous", 
      populate: {
         path: "professionel",
         populate:{
          path: "user"
         } 
      }
   }).populate({
    path: "RendezVous", 
    populate: {
      path: "patient",
      populate:{
        path: "user" 
      }
    }
 })
      .then(notif => {
        if (!notif) {
          errors.nonotif = 'There is no notif ';
          return res.status(404).json(errors);
        }
        res.json(notif);
      })
      .catch(err => res.status(404).json(err));
  }
);
router.put(
  '/changeEtat/:id',
 
  async (req, res) => {
      try {
          const {etat} = req.body;
       const Notif = await Notification.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            etat: etat
        }
    });
    if(!Notif)
    {
        return res.status(400).json({msg:'There is no Notification'});
    }
    const Notifs = await Notification.find();

    res.json(Notifs);


} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
}
}
);


module.exports = router;