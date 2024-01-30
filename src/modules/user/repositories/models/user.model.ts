import { Schema, model } from "mongoose";
import { IUser } from "../../entities/IUser";

const userSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  contact: {
    type: {
      email: { type: String, required: true, unique: true },
      phone: { type: String, unique : true },
    },
    required:true,
    unique : true
  },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
});

const User = model<IUser>("User", userSchema);
export default User;
