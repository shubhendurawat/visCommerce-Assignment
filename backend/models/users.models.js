import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"]
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            required: true,
            default: ""
        }
    },
    { timestamps: true })

const User = mongoose.model("User", userSchema); 
export default User