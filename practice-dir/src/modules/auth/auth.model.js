import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        required: [true, 'Name field is required'],
    },
    email: {
        type: String,
        trim: true,
        maxlength: 266,
        unique: true,
        lowercase: true,
        required: [true, 'Email field is required']
    },
    password: {
        type: String,
        trim: true,
        maxlength: 50,
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'seller'],
        default: 'customer',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        select: false,
    },
    verifyTokenExpires: {
        type: Date,
        select: false,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        select: false,
    }

}, { timestamps: true });

// used pre hook to create hashed password and save in db;
userSchema.pre('save', async function (next) {
    if (!this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

// created compare method for password comparation
userSchema.method.comparePassword = async function (clientPassword) {
    return bcrypt.compare(clientPassword, this.password);
}

export default mongoose.model('User', userSchema);
