import { Schema, model, connect } from "mongoose";

interface Post {
  title: string;
  content: string;
  date: Date;
  category: string;
}

const schema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
});

const PostModel = model<Post>("Post", schema);

export default PostModel;
