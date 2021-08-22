import { Schema, model } from "mongoose";

interface Like {
  userId: string;
  postId: string;
}

const schema = new Schema<Like>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
});

const LikeModel = model<Like>("Like", schema);

export default LikeModel;
