import {Schema,model,Document} from 'mongoose';

const PostSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  user:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  image:{
    path:{
      type:String
    },
    filename:{
      type:String
    }
  },
  created_at:{
    type:Date,
    default:new Date(Date.now())
  }
});

export interface IPost extends Document{
  title:string,
  user:string,
  description:string,
  image:{
    path:string,
    filename:string
  }
}

const PostModel = model<IPost>('posts',PostSchema);

export default PostModel;