import { Schema, model } from "mongoose";

interface Comment {
  userId: string;
  postId: string;
  content: string;
}

const schema = new Schema<Comment>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  content: { type: String, required: true },
});

const CommentModel = model<Comment>("Comment", schema);

export default CommentModel;
