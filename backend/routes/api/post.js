const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../../middleware/auth');


const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route  POST api/posts
// @desc  creta a post route
// @access Private
router.post('/file/:id',auth, async(req , res) =>{
const errors = validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
}
try {
    let filepost=null;
    //const file = req.files.file;

    if(req.files.file){
      let filename = Date.now()+'-'+req.files.file.name;
      req.files.file.mv('public/images/posts/'+filename)
      filepost='public/images/posts/'+filename;

    }
    const user = await Profile.findOne({user:req.params.id});
    if(req.body.type === 'file'){
        const newPost = new Post( {
            text: filepost,
            user: user._id,
            type: req.body.type
        });
        const post = await newPost.save();

    }else{
        const newPost = new Post( {
            text: req.body.text,
            user: user._id,
            type: req.body.type
        });
        const post = await newPost.save();
    }

const posts = await Post.find({ user : user._id })
    .populate({
        path: "user",
        populate: {
            path: "user",
          }
     })
     .populate({
        path: "likes",
        populate: {
            path: "user",
            populate:{
                path:"user"
            }
          }
     })
     .populate({
        path: "comments",
        populate: {
            path: "user",
            populate:{
                path:"user"
            }
          }
     })
    .sort({date: -1});
res.json(posts);
    
} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
    
}

} );
router.post('/:id',[auth,[
    check('text','Text is required').not().isEmpty()

]], async(req , res) =>{
const errors = validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
}
try {
    const user = await Profile.findOne({user:req.params.id});
const newPost = new Post( {
    text: req.body.text,
    user: user._id,
});
const post = await newPost.save();
const posts = await Post.find({ user : user._id })
    .populate({
        path: "user",
        populate: {
            path: "user",
          }
     })
     .populate({
        path: "likes",
        populate: {
            path: "user",
            populate:{
                path:"user"
            }
          }
     })
     .populate({
        path: "comments",
        populate: {
            path: "user",
            populate:{
                path:"user"
            }
          }
     })
    .sort({date: -1});
res.json(posts);
    
} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
    
}

} );
// @route  GET api/posts
// @desc  get all posts
// @access Private
router.get('/mypost/:id',auth,async(req,res)=> {
try {
    const posts = await Post.find({ user : req.params.id })
    .populate({
        path: "user",
        populate: {
            path: "user",
          }
     })
     .populate({
        path: "likes",
        populate: {
            path: "user",
            populate:{
                path:"user"
            }
          }
     })
     .populate({
        path: "comments",
        populate: {
            path: "user",
            populate:{
                path:"user"
            }
          }
     })
    .sort({date: -1});
    res.json(posts);
    
} catch (error) {
    console.error(error.message);
    return res.status(500).send('server error');
    
}
});
// @route  GET api/posts
// @desc  get all posts
// @access Private
router.get('/all',auth,async(req,res)=> {
    try {
        const posts = await Post.find()
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1});
        res.json(posts);
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('server error');
        
    }
    });
// @route  GET api/posts/:id
// @desc  get  post by id
// @access Private
router.get('/:id',auth,async(req,res)=> {
    try {
        const post = await Post.findById(req.params.id)
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        if(!post) {
            return res.status(404).json({msg: 'post not found'});
        }

        res.json(post);
        
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
        
    }
    });
// @route  DELETE api/posts/:id
// @desc  get  post by id
// @access Private
router.delete('/:id/:idU',auth,async(req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
        const user = await Profile.findOne({user:req.params.idU});

        if(!post) {
            return res.status(404).json({msg: 'post not found'});
        }
       
        await post.remove();
        res.json(await Post.find({ user : user._id })
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1}));
        
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
        
    }
    });
// @route  PUT api/posts/like/:id
// @desc  like a post
// @access Private
router.put('/like/:id/:idU',auth,async(req,res)=>{
    try {
        const user = await Profile.findOne({user:req.params.idU});
        const post = await Post.findById(req.params.id)
        console.log(post)
        if(post.likes.filter(like => like.user.toString() === user._id).length > 0) {
            return res.status(400).json({msg : 'Post already liked'});
        }
        post.likes.unshift({user: user._id});
        await post.save();
        res.json(await Post.find({ user : post.user })
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1}));
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
    }
});
// @route  PUT api/posts/unlike/:id
// @desc  like a post
// @access Private
router.put('/unlike/:id/:idU',auth,async(req,res)=>{
    try {
        const user = await Profile.findOne({user:req.params.idU});
        const post = await Post.findById(req.params.id);
        console.log(post)
        console.log(user._id)
        console.log(post.likes)
        await Post.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                likes: { user: user._id},
            }
        });
        res.json(await Post.find({ user : post.user })
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1}));
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
    }
});

// @route  POST api/posts/comment/:id
// @desc  comment on a post route
// @access Private
router.post('/comment/:id/:idU',[auth,[
    check('text','Text is required').not().isEmpty()

]], async(req , res) =>{
const errors = validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
}
try {
    const user = await Profile.findOne({user:req.params.idU});
    const post = await Post.findById(req.params.id)

    const newComment =  {
    text: req.body.text,
    user: user._id

};
post.comments.unshift(newComment);
 await post.save();
res.json(await Post.find({ user : post.user })
.populate({
    path: "user",
    populate: {
        path: "user",
      }
 })
 .populate({
    path: "likes",
    populate: {
        path: "user",
        populate:{
            path:"user"
        }
      }
 })
 .populate({
    path: "comments",
    populate: {
        path: "user",
        populate:{
            path:"user"
        }
      }
 })
.sort({date: -1}));
    
} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
    
}

} );

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc  delete comment
// @access Private
router.delete('/comment/:id/:comment_id/:idU',auth,async(req,res)=> {
    try {
        const user = await Profile.findById(req.params.idU);

        const post = await Post.findById(req.params.id)
        
        if(!post) {
            return res.status(404).json({msg: 'post not found'});
        }
        await Post.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                comments: { _id: req.params.comment_id},
            }
        });
        res.json(await Post.find({ user : post.user })
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1}));
        
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
        
    }
    });
    // @route  PUT api/posts/like/:id
// @desc  like a post
// @access Private
router.put('/comment/like/:id/:comment_id/:idU',auth,async(req,res)=>{
    try {
        const user = await Profile.findOne({user:req.params.idU});
        const post = await Post.findById(req.params.id);
      
           await Post.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    comments: { likes: {user: user._id}},
                }
            });
           
        res.json(await Post.find({ user : user._id })
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1}));
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
    }
});
// @route  PUT api/posts/unlike/:id
// @desc  like a post
// @access Private
router.put('/comment/unlike/:id/:comment_id/:idU',auth,async(req,res)=>{
    try {
        const user = await Profile.findOne({user:req.params.idU});
        const post = await Post.findById(req.params.id);
       
           await Post.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    comments: { likes: {user: user._id}},
                }
            });
        res.json(await Post.find({ user : user._id })
        .populate({
            path: "user",
            populate: {
                path: "user",
              }
         })
         .populate({
            path: "likes",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
         .populate({
            path: "comments",
            populate: {
                path: "user",
                populate:{
                    path:"user"
                }
              }
         })
        .sort({date: -1}));
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'});
        }
        return res.status(500).send('server error');
    }
});

module.exports = router;