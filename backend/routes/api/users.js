const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mailer = require('../../misc/mailer');
const levenshtein = require('fast-levenshtein');
const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

//const Profile = require('../../model/Profile');
// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', [
    check('firstName', 'firstName is required').not().isEmpty(),
    check('lastName', 'lastName is required').not().isEmpty(),
    check('role', 'role is required').not().isEmpty(),

    check('email', 'please include a valid email').isEmail(),
    check('password', 'enter a password with 6 or greater').isLength(
        {min: 6}
    )
], async (req, res) => {

    // const errors = validationResult(req);
    // if (! errors.isEmpty()) {
    //     return res.status(400).json({errors: errors.array()});
    // }
    const {firstName, lastName, email, password, role, sexe, birthDate} = req.body;
    try {
        //console.log("tesssssst") // see if user exists
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'user already exists'
                    }
                ]
            });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            sexe,
            birthDate
        });
        // encrypt passsword
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // generate secret token
        const secretToken = randomstring.generate(6);
        user.secretToken = secretToken;
        await user.save();
        // send email
        
        console.log("passed1")

//email template
const html=`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
 
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>A Simple Responsive HTML Email</title>
  <style type="text/css">
  body {margin: 0; padding: 0; min-width: 100%!important;}
  img {height: auto;}
  .content {width: 100%; max-width: 600px;}
  .header {padding: 40px 30px 20px 30px;}
  .innerpadding {padding: 30px 30px 30px 30px;}
  .borderbottom {border-bottom: 1px solid #f2eeed;}
  .subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}
  .h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}
  .h1 {font-size: 33px; line-height: 38px; font-weight: bold;}
  .h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}
  .bodycopy {font-size: 16px; line-height: 22px;}
  .button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}
  .button a {color: #ffffff; text-decoration: none;}
  .footer {padding: 20px 30px 15px 30px;}
  .footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}
  .footercopy a {color: #ffffff; text-decoration: underline;}

  @media only screen and (max-width: 550px), screen and (max-device-width: 550px) {
  body[yahoo] .hide {display: none!important;}
  body[yahoo] .buttonwrapper {background-color: transparent!important;}
  body[yahoo] .button {padding: 0px!important;}
  body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important;}
  body[yahoo] .unsubscribe {display: block; margin-top: 20px; padding: 10px 50px; background: #2f3942; border-radius: 5px; text-decoration: none!important; font-weight: bold;}
  }

  /*@media only screen and (min-device-width: 601px) {
    .content {width: 600px !important;}
    .col425 {width: 425px!important;}
    .col380 {width: 380px!important;}
    }*/

  </style>
</head>

<body yahoo bgcolor="#f6f8f1">
<table width="100%" bgcolor="#f6f8f1" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <!--[if (gte mso 9)|(IE)]>
      <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
    <![endif]-->     
    <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td bgcolor="#70bfd7" class="header">
          <table width="70" align="left" border="0" cellpadding="0" cellspacing="0">  
            <tr>
              <td height="70" style="padding: 0 20px 20px 0;">
                <img class="fix" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/icon.gif" width="70" height="70" border="0" alt="" />
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
            <table width="425" align="left" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
          <![endif]-->
          <table class="col425" align="left" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 425px;">  
            <tr>
              <td height="70">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="subhead" style="padding: 0 0 0 3px;">
                      Labes.tn
                    </td>
                  </tr>
                  <tr>
                    <td class="h1" style="padding: 5px 0 0 0;">
Welcome to our community                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
      <tr>
        <td class="innerpadding borderbottom">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="h2">
Please verify your account!              </td>
            </tr>
            <tr>
              
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="innerpadding borderbottom">
          <table width="115" align="left" border="0" cellpadding="0" cellspacing="0">  
            <tr>
              <td height="115" style="padding: 0 20px 20px 0;">
                <img class="fix" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/article1.png" width="115" height="115" border="0" alt="" />
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
            <table width="380" align="left" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
          <![endif]-->
          <table class="col380" align="left" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 380px;">  
            <tr>
              <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="h2">
                     this is your token: ${secretToken}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0 0 0;">
                      <table class="buttonwrapper" bgcolor="#e05443" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="button" height="45">
                            <a href="http://localhost:4200/#/examples/verify">Verify</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
      <tr>
  
      </tr>
      <tr>
        <td class="innerpadding bodycopy">
         
        </td>
      </tr>
      <tr>
        <td class="footer" bgcolor="#44525f">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" class="footercopy">
                &reg; tunisia, tunis 2021<br/>
                <a href="#" class="unsubscribe"><font color="#ffffff">chech</font></a> 
                <span class="hide"> our social media</span>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0 0 0;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="37" style="text-align: center; padding: 0 10px 0 10px;">
                      <a href="http://www.facebook.com/">
                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/facebook.png" width="37" height="37" alt="Facebook" border="0" />
                      </a>
                    </td>
                    <td width="37" style="text-align: center; padding: 0 10px 0 10px;">
                      <a href="http://www.twitter.com/">
                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/twitter.png" width="37" height="37" alt="Twitter" border="0" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--[if (gte mso 9)|(IE)]>
          </td>
        </tr>
    </table>
    <![endif]-->
    </td>
  </tr>
</table>
</body>
</html>

`;

        // this is supposed to send an email to the user - it doesn't work ans make the post crash
        //await mailer.sendMail('labes.assitance@gmail.com', user.email, 'please verify your account', html)

        // return json webtoken
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: 360000
        }, (err, token) => {
            if (err) 
                throw err;
            
            res.json({token});
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server  error');

    }

});
// @route  GET api/users/all
// @desc  get all users
// @access Private
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();

        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

// @route  GET api/users/:_id
// @desc  get User By Id
// @access Private
router.get('/:id', async (req, res) => {
    try {

        const users = await User.find({_id: req.params.id, role: 'Student'});
        if (users) {
            return res.json(users);
        } else {
            return res.json({err: 'not found'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

// @route  POST api/users/check
// @desc   Check if user exists
// @access Public
router.post('/check', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.json({ isUserExist: true });
    } else {
      return res.json({ isUserExist: false });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// // @route  GET api/users/praticien/:lastName/:firstName
// // @desc  get praticien User By name
// // @access Private
// router.get('/praticien/:lastName-:firstName', async (req, res) => {
//   const { lastName, firstName } = req.params;

//   try {
//     const users = await User.find({ role: 'praticien' });

//     if (users) {
//       const filteredUsers = users
//         .map(user => ({
//           ...user.toObject(),
//           levenshteinDistance: levenshtein.get(user.lastName, lastName)
//         }))
//         .filter(user => user.levenshteinDistance < 3)
//         .sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);

//       return res.json(filteredUsers);
//     } else {
//       return res.json({ err: 'not found' });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('server error');
//   }
// });

module.exports = router;