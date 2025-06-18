import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  
  name: { type: String },
  phone: { type: String },
  gender: { type: String },
  dob: { type: Date },
  Address: { type: String },
  state: { type: String },
  city: { type: String },
  profilePic: {
    type: String,
  },
  bio: { type: String },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
