// creating schema
import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    // name: String, // or can we written as (on the go validation here)
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 200,
        // required: true // or can be written as
        required: [true, "Name field is required"],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        maxlength: 20,
        select: false,
    },
    role: {
        type: String,
        emun: ["customer", "seller", "admin"],
        default: "customer", // always required default value while using emuns
    },
    isVerified: {
        type: String,
        default: false,
    },
    verificationToken: {
        type: String,
        select: false, // when the complete model will create a obj user then the whole data returns
        // so, select prevents this field to return (for safety purpose)
    },
    refreshToken: {
        type: String,
        select: false,
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    selectPasswordExpires: {
        type: Date,
        select: false,
    },
}, { timestamps: true });
// the timestamps is a second argument and it automatically create updatedAt & createdAt for the model

// using middlewares for mongoose (user these hooks run for an activity/ events)
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12); // bcrypt.hash takes 2 params first string, second salt (12 is standard but in ruby and rails it's 10), generally it's a heavy task
    next();
});

// when we don't have any event jsut want to add some basic func (same sa polyphills on js prototypes)
userSchema.methods.comparePasswords = async function (clearTextpassword) {
    return await bcrypt.compare(clearTextpassword, this.password); // direct compares donot have to handle salts or anything so it is fast (can be run without await too.)
}

export default mongoose.model("User", userSchema);
// it always convertes in database like: "User" => "users"
// changes into lowercase and plural
