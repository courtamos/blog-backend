import { Schema, model, connect } from "mongoose";

enum UserType {
  normal = "normal",
  admin = "admin",
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subscribed: boolean;
  type: UserType;
}

const schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  subscribed: { type: Boolean, default: true },
  type: { type: String, enum: UserType, default: UserType.normal },
});

const UserModel = model<User>("User", schema);

export default UserModel;
