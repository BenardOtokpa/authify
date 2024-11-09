const mongoose =require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Email is required!'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'please use a valid email address']
    },
    password: {
        type:String,
        minlength: 8,
        required:[true, 'Password is required']
    },
    passwordConfirm: {
        type:String,
        minlength: 8,
        required:[true, 'Confirm Password is required']
    },
    }
    isVerified:{
        type: Boolean,
        default: false
    },
    mfaSecret: String,
})

const User = new mongoose.model('User', userSchema)

module.exports = User;