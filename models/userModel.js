const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please use a valid email address'],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,

    validate: {
      //validating the confirm password matches with the password
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },

  isMFAEnabled: {
    type: Boolean,
    default: false,
  },
  mfaSecret: String,
});

//Hashing the password on save and only when modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
