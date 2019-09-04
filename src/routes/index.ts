import {Router,Request,Response} from 'express';
import {unlink} from "fs-extra";

import PostModel,{IPost} from '../models/Post'; 

const router = Router()

router.get('/',async function (req:Request,res:Response){
  try {
    
    const posts = await PostModel.find();

    res.render('index',{posts});
    
  } catch (err) {
    console.log(err)
    return res.send('Something went wrong.');
  }
});

router.route('/add')
  .get(function(req:Request,res:Response){
    res.render('add_post')
  })
  .post(async function(req:Request,res:Response){
    try {
      
      const {title,description,user} = req.body;

      const newPost = new PostModel({
        title,
        description,
        user:user.toLowerCase().replace('@','')
      });

      if(req.file){
        newPost.image = {
          path:req.file.path,
          filename:req.file.filename
        };
      }
      
      await newPost.save();
      
      res.redirect('/');
      
    } catch (err) {
      console.log(err);
      res.send('Something went wrong');
    }
  });
  
router.get('/user/:user',async function (req:Request,res:Response){
  try {
    const {user} = req.params;

    const posts = await PostModel.find({user});

    return res.render('user_post',{user,posts})

  } catch (err) {
    console.log(err);
    return res.send('Something went wrong');
  }
});

router.get('/delete/:id',async function (req:Request,res:Response){
  try {
    const {id} = req.params;

    const post = await PostModel.findByIdAndDelete(id) as IPost;

    if(post.image.path){
      await unlink(post.image.path)
    }

    res.redirect('/');

  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

router.route('/edit/:id')
  .get(async function (req:Request,res:Response){
    try {
      const {id} = req.params;
      
      const post = await PostModel.findById(id);

      res.render('edit_post',{post});

    } catch (err) {
      console.log(err);
      res.send('Something went wrong.');
    }
  })
  .post(async function (req:Request,res:Response){
    try {
      const {id} = req.params;
      const {title,description,user,oldImagePath,oldImageFilename,oldTitle,oldDescription,oldUser} = req.body;
      
      const editedPost = {
        title:"",
        description:"",
        user:"",
        image:{
          path:"",
          filename:""
        }
      };

      if(title){
        editedPost.title = title;
      }else{
        editedPost['title'] = oldTitle;
      }

      if(description){
        editedPost['description'] = description;
      }else{
        editedPost['description'] = oldDescription;
      }

      if(user){
        editedPost['user'] = user;
      }else{
        editedPost['user'] = oldUser;
      }

      if(req.file){
        editedPost['image'] = {
          path:req.file.path,
          filename:req.file.filename
        }

        if(oldImagePath){
          await unlink(oldImagePath);
        }
      }else{
        editedPost['image'] = {
          path:oldImagePath,
          filename:oldImageFilename
        };
      }

      console.log(editedPost);

      await PostModel.findByIdAndUpdate(id,editedPost);

      res.redirect('/');

    } catch (err) {
      console.log(err);
      res.send('Something went wrong.');
    }
  });


export default router;