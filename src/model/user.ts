import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import Task from "./task";

const validator = require('validator');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Please enter valid age");
            }
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        lowerCase: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps: true
})

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'HelloMonit')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

UserSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("unable to login!");
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("unable to login!");
    }
    return user
}

//Hash plain text before saving
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

//Delete user tasks when user is deleted
UserSchema.pre('delete', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', UserSchema)

export default User;