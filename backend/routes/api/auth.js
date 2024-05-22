const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check,validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mailer = require('../../misc/mailer');
const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// @route  GET api/auth
// @desc  Test route
// @access Public
router.get('/',auth, async(req , res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server message');
    }
});

// @route    POST api/auth/act
// @desc     verfier  user 
// @access   Public
router.post('/act', async(req,res) => {
   try{
        const {secretToken} = req.body;
        const user = await User.findOne({ secretToken });
    if(!user){
        return res 
        .status(400)
        .json({errors: [{msg: 'invalid credentials'}]});
  }
    user.activated=true
    user.secretToken='';
    await user.save();
        console.log(secretToken);
    res.json(secretToken);

   }catch(err){console.error(error.message);
    res.status(500).send('server message');}
});

// @route    POST api/auth
// @desc     Authenticate  user & get token
// @access   Public
router.post('/',[
    check('email', 'please include a valid email').isEmail(),
    check('password', 'password required').exists()
], async(req, res) => {

   const errors = validationResult(req);
   if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }
const { email, password} = req.body;

try {
    //see if user exists
let user = await User.findOne({ email });
if(!user){
   return res 
   .status(400)
   .json({errors: [{msg: 'Invalid credentials'}]});
}
if(user.activated === false) {
    return res 
   .status(400)
   .json({errors: [{msg: 'account is disabeld'}]});
}
const isMatch = await bcrypt.compare(password,user.password);
if(!isMatch) {
    return res
    .status(400)
    .json({errors: [{msg: 'mot de passe incorrect'}]});
 }
    const payload = {
        user:{
            id: user._id,
            email:user.email,
            role:user.role
        }
    };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token) => {
            if(err) throw err;
            res.json({token:token,user:user});
            }
            );

}catch(err){
    console.error(err.message);
    res.status(500).send('server  error');

}

});

// @route    POST api/auth
// @desc     Authenticate  user & get token
// @access   Public
router.post('/logout',auth, async(req, res) => {

try {
    console.log(req.user)
    if(req.user){
        req.user = null;
        console.log(req.user)

    }
    res.json({ updated :true , Message: "logout"});

}catch(err){
    console.error(err.message);
    res.status(500).send('server  error');

}

});
router.put('/updatePassword',auth ,async(req, res) => {
    const { newPass, oldPass} = req.body;
    let user = await User.findById(req.user.id);
if(!user){
   return res 
   .status(400)
   .json({errors: [{msg: 'Invalid credentials'}]});
}
if(user.activated === false) {
    return res 
   .status(400)
   .json({errors: [{msg: 'account is disabeld'}]});
}
console.log(user)
    const isMatch = await bcrypt.compare(oldPass,user.password);
    if(!isMatch) {
        return res
        .status(400)
        .json({errors: [{msg: 'mot de passe incorrect'}]});
     }
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(newPass, salt);
     await user.save();
     res.json({ updated :true , Message: "Mot de passe mis à jour avec succès"});
});

router.put('/resetPass', async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({errors: [{msg: 'Utilisateur introuvable'}]});
    }
    const newPass = randomstring.generate(6);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);
    await user.save();
    const html= `hi there, 
    <br/>
    This is your new password : ${newPass}
    <br/>
    For more information please check your calendar .
    `;
    await mailer.sendMail('labes.assitance@gmail.com', user.email, 'Reset password', html)
    res.json({ updated :true , Message: "Email envoyé"});

});
module.exports = router;