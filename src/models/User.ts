import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
    name: string
    email: string
    password: string
    role: 'citizen' | 'admin'
    createdAt: Date
    comparePassword(password: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password should be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['citizen', 'admin'],
        default: 'citizen',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
