const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateAddressInput = require('../../validation/address');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');
const { validationResult } = require('express-validator');
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "application/pdf" :"pdf",
    "application/vnd.ms-excel" :"xls",
    "application/vnd.ms-powerpoint" :"ppt",
    "application/msword" : "doc"
  };
  var multer = require('multer');
    var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../../uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});
router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
  
})
// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get(
  '/me',
  auth,
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
    .populate({
      path: "user",
   })
   .populate({
    path: "abonnes",
    populate: {
      path: "user",
    }
 }).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/', (req, res) => {
  const errors = {};

  Profile.find()
  .populate({
    path: "user",
 })
 .populate({
  path: "abonnes",
  populate: {
    path: "user",
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});
// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/sorted', (req, res) => {
  const errors = {};

  Profile.find()
  .populate({
    path: "user",
 })
 .populate({
  path: "abonnes",
  populate: {
    path: "user",
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
}).sort({rating: -1}).limit(3)
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});
// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['firstName', 'lastName','birthDate','sexe'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ _id: req.params.user_id })
  .populate({
    path: "user",
 }).populate({
  path: 'abonnes',
  populate:{
    path:'user'
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})

    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      console.log(profile)

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});
router.get('/byId/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
  .populate({
    path: "user",
 }).populate({
  path: 'abonnes',
  populate:{
    path:'user'
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/:id',
 auth,
  (req, res) => {
    //const url = req.protocol + "://" + req.get("host");
     const errors = validationResult(req);
    // if (! errors.isEmpty()) {
    //     return res.status(400).json({errors: errors.array()});
    // }
      //const { errors1, isValid } = validateProfileInput(req.body);

    //  //Check Validation
    //   if (!isValid) {
    //   //Return any errors with 400 status
    //    return res.status(400).json(errors1);
    //  }

    // Get fields
    if(!req.files) {
                  res.send({
                      status: false,
                      message: 'No file uploaded'
                  });
              }
    console.log(req.files);
    console.log(req.body)
    const profileFields = {};
    let imageDiplome=null;
    let avatar=null;
    let cv=null;
    const fileDiplome = req.files.imageDiplome;

    if(req.files.imageDiplome){
      let filename = Date.now()+'-'+fileDiplome.name;
      fileDiplome.mv('public/images/users/'+filename)
      imageDiplome='public/images/users/'+filename;

    }
    const fileAvatar = req.files.avatar;

    if(req.files.avatar){
      let filename = Date.now()+'-'+fileAvatar.name;
      fileAvatar.mv('public/images/users/'+filename)
      avatar='public/images/users/'+filename;

    }
    const filecv = req.files.cv;

    if(req.files.cv){
      let filename = Date.now()+'-'+filecv.name;
      filecv.mv('public/images/users/'+filename)
      cv='public/images/users/'+filename;

    }

    profileFields.user = req.params.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (imageDiplome) profileFields.imageDiplome = imageDiplome;
    if (req.body.domainePrincipal) profileFields.domainePrincipal = req.body.domainePrincipal;
    if (req.body.description) profileFields.description = req.body.description;
    if (req.body.video) profileFields.video = req.body.video;
    if (req.body.metier) profileFields.metier = req.body.metier;
    if (req.body.prixPCR) profileFields.prixPCR = req.body.prixPCR;
    if (avatar) profileFields.avatar = avatar;
    if (cv) profileFields.CV = cv;
    if (typeof req.body.diplome !== 'undefined') {
      profileFields.diplome = req.body.diplome.split(',');
    }
    if (typeof req.body.domaineSecondaires !== 'undefined') {
      profileFields.domaineSecondaires = req.body.domaineSecondaires.split(',');
    }
    if (typeof req.body.tags !== 'undefined') {
      profileFields.tags = req.body.tags.split(',');
    }
    

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    profileFields.telephone = {};
    if (typeof req.body.mobile !== 'undefined') {
      profileFields.telephone.mobile = req.body.mobile.split(',');
    }
    if (typeof req.body.fix !== 'undefined') {
      profileFields.telephone.fix = req.body.fix.split(',');
    }
    
    profileFields.address = {};
    if (req.body.gouvernerat) profileFields.address.gouvernerat = req.body.gouvernerat;
    if (req.body.ville) profileFields.address.ville = req.body.ville;
    if (req.body.cite) profileFields.address.cite = req.body.cite;

    Profile.findOne({ user: req.params.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.params.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create


          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
       
      }
    });
  }
);

router.post(
  '/client/:id',
 auth,
  (req, res) => {
    //const url = req.protocol + "://" + req.get("host");
     const errors = validationResult(req);
    // if (! errors.isEmpty()) {
    //     return res.status(400).json({errors: errors.array()});
    // }
      //const { errors1, isValid } = validateProfileInput(req.body);

    //  //Check Validation
    //   if (!isValid) {
    //   //Return any errors with 400 status
    //    return res.status(400).json(errors1);
    //  }

    // Get fields
    if(!req.files) {
                  res.send({
                      status: false,
                      message: 'No file uploaded'
                  });
              }
    console.log(req.files);
    console.log(req.body)
    const profileFields = {};
    let avatar=null;
    
    const fileAvatar = req.files.avatar;

    if(req.files.avatar){
      let filename = Date.now()+'-'+fileAvatar.name;
      fileAvatar.mv('public/images/users/'+filename)
      avatar='public/images/users/'+filename;

    }
    

    profileFields.user = req.params.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.description) profileFields.description = req.body.description;
    if (avatar) profileFields.avatar = avatar;
    
    profileFields.telephone = {};
    if (typeof req.body.mobile !== 'undefined') {
      profileFields.telephone.mobile = req.body.mobile.split(',');
    }
    if (typeof req.body.fix !== 'undefined') {
      profileFields.telephone.fix = req.body.fix.split(',');
    }
    
    profileFields.address = {};
    if (req.body.gouvernerat) profileFields.address.gouvernerat = req.body.gouvernerat;
    if (req.body.ville) profileFields.address.ville = req.body.ville;
    if (req.body.cite) profileFields.address.cite = req.body.cite;
 // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    Profile.findOne({ user: req.params.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.params.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);







// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
 auth,
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);



router.post('/upload',auth,async(req,res)=>{
  try {
    if(req.files == null) {
      return res.status(400).json({ msg: 'No file uploaded'});
    }
    const file = req.files.file;
  
    file.mv(`${__dirname}../../../client/public/uploads/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
     
      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
    const profileFields={};
    profileFields.CV='/uploads/'+file.name;

   await Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields});
    const profile =await Profile.findOne({user: req.user.id});
    console.log(profile)
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})

router.post('/setAvailable/:id',auth,async(req,res)=>{
  try {
    console.log(req.body)
    console.log(req.user.id)
    const profileFields={};
    profileFields.available = {};
    
    if (req.body.start)profileFields.available.startDate=req.body.start;
    if (req.body.end)profileFields.available.endDate=req.body.end;
    
   await Profile.findOneAndUpdate({user: req.params.id},{$push: {
    available: profileFields.available
}});
    const profile =await Profile.findOne({user: req.params.id}).populate({
      path: "user",
   })
   .populate({
    path: "abonnes",
    populate: {
      path: "user",
    }
 }).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
});
    console.log(profile)
    return  res.json((profile));
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/deleteAvailable/:id/:idU',auth,async(req,res)=>{
  try {
   
   let pro = await Profile.findOneAndUpdate({
      user: req.params.idU
  }, {
      $pull: {
          available: {
              _id: req.params.id
          }
      }
  });
  return res.json(await Profile.findOne({user: req.params.idU }).populate({
    path: "user",
 })
 .populate({
  path: "abonnes", 
  populate: {
    path: "user",
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
}));
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/deleteAvailableConfirmation/:id/:idA',auth,async(req,res)=>{
  try {
   
   let pro = await Profile.findOneAndUpdate({
      _id: req.params.id
  }, {
      $pull: {
          available: {
              _id: req.params.idA
          }
      }
  });
  return res.json(await Profile.findOne({ _id: req.params.id }).populate({
    path: "user",
 })
 .populate({
  path: "abonnes",
  populate: {
    path: "user",
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
}));
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/abonnee/:idP/:idA',async(req,res)=>{
  try {
    const user = await Profile.findOne({user:req.params.idA});

   let pro = await Profile.findOneAndUpdate({
      _id: req.params.idP
  }, {
      $push: {
        abonnes:  user._id}
      }
  );
  return res.json(await Profile.findOne({ _id: req.params.idP }).populate({
    path: "user",
 }).populate({
  path: 'abonnes',
  populate:{
    path:'user'
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
 );
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/desabonnee/:idP/:idA',auth,async(req,res)=>{
  try {
    const user = await Profile.findOne({user:req.params.idA});

   let pro = await Profile.findOneAndUpdate({
      _id: req.params.idP
  }, {
      $pull: {
        abonnes:user._id}
      }
  );
  return res.json(await Profile.findOne({ _id: req.params.idP }).populate({
    path: "user",
 }).populate({
  path: 'abonnes',
  populate:{
    path:'user'
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
 );
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/rate/:idP',auth,async(req,res)=>{
  try {
    const {rate} = req.body;
   let pro = await Profile.findOneAndUpdate({
      _id: req.params.idP
  }, {
    $inc : {rating : rate}});
  return res.json(await Profile.findOne({ _id: req.params.idP }).populate({
    path: "user",
 }));
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/getAbonnes/:idP', (req, res) => {
  const errors = {};

  Profile.findOne({ _id: req.params.idP })
  .populate({
    path: "user",
 })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      let abonnes = profile.abonnes ;
      res.json(abonnes);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});
router.put('/addReview/:idP/:idA',async(req,res)=>{
  try {
    const user = await Profile.findOne({user:req.params.idA});
    const newReview =  {
      description: req.body.description,
      user: user._id,
      type: req.body.type,
  };
  let profe = await Profile.findOne({
    _id: req.params.idP
} 
);
console.log(profe.reviews.length)
  if(req.body.type == 'yes'){
    //let rating = (profe.nbyes * 5) / profe.reviews.length ; 
    let pro = await Profile.findOneAndUpdate({
      _id: req.params.idP
  }, {
      $push: {
        reviews:  newReview
      },
      $inc : {
        nbyes: 1
      }
      }
      
  );
  }else{
    //let rating = (profe.nbno * 5) / profe.reviews.length ; 

    let pro = await Profile.findOneAndUpdate({
      _id: req.params.idP
  }, {
      $push: {
        reviews:  newReview
      },
      $inc : {
        nbno: 1
      }
      }
      
  );
  }
  
  return res.json(await Profile.findOne({ _id: req.params.idP }).populate({
    path: "user",
 }).populate({
  path: 'abonnes',
  populate:{
    path:'user'
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
 );
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/commentReview/:idR/:idA',async(req,res)=>{
  try {
    const user = await Profile.findOne({user:req.params.idA});
    const newComment =  {
      text: req.body.text,
      user: user._id,
  };
  //  let pro = await Profile.update({
  //    "reviews._id":req.params.idR
  // }, {
  //     $set: {
  //       reviews:{
  //         $push:{comments:newComment}
  //         }}
  //     }
  // );
  await Profile.update(
    {
      _id: user._id,
      "reviews._id":req.params.idR
    },
    { $push: { "reviews.$.comments" : newComment } }
 );
  return res.json(await Profile.findOne({ _id: user._id }).populate({
    path: "user",
 }).populate({
  path: 'abonnes',
  populate:{
    path:'user'
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
})
 );
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
router.put('/updateRate/:id',auth,async(req,res)=>{
  try {
   const {rate}=req.body;
   console.log(rate)
   let pro = await Profile.findOneAndUpdate({
      user: req.params.id
  }, {
      $set: {
          rating: rate
      }
  });
  return res.json(await Profile.findOne({user: req.params.id }).populate({
    path: "user",
 })
 .populate({
  path: "abonnes", 
  populate: {
    path: "user",
  }
}).populate({
  path: 'reviews',
  populate:{
    path:'user',
    populate:{
      path:'user'
    }
  }
}));
  
}
   catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})
module.exports = router;