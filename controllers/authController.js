const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const speakeasy = require('speakeasy');

const nodemailer = require('nodemailer');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

// Generate an MFA secret when the user enables MFA
const generateMfaSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

// Send magic link function
const sendMagicLink = async (email, token) => {
  const magicLink = `https://yourapp.com/auth/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your Magic Login Link',
    text: `Click here to login: ${magicLink}`,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // Generate and store the MFA secret for the user
    const mfaSecret = generateMfaSecret();
    newUser.mfaSecret = mfaSecret.base32;

    // Save the user with the MFA secret
    await newUser.save();

    console.log('User MFA setup:', { mfaSecret: newUser.mfaSecret });

    const token = signToken({ id: newUser._id });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || err,
    });
  }
};

// Login endpoint with MFA  and magic link option
exports.login = async (req, res, next) => {
  try {
    const { email, password, useMagicLink } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists and verify password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Magic Link Option
    if (useMagicLink) {
      const magicToken = signToken(user._id.toString());

      await sendMagicLink(user.email, magicToken);
      return res.status(200).json({
        status: 'success',
        message: 'Magic link sent to your email.',
      });
    }

    // MFA Option
    if (user.isMFAEnabled && !useMagicLink) {
      return res.status(200).json({
        status: 'mfa_required',
        message: 'MFA required. Please verify MFA code.',
      });
    }

    // ** Standard Login: issue JWT token **
    const token = signToken({ id: user._id });
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'An unknown error occurred',
    });
  }
};

exports.verifyMFA = async (req, res, next) => {
  const { token, id } = req.body;
  try {
    // Fetch user from DB
    const user = await User.findById(id);

    if (!user) {
      console.error('User not found');
      return next(new AppError('User not found', 404));
    }

    if (!user.mfaSecret) {
      return next(new AppError('MFA setup not found for this user', 400));
    }

    // Verify MFA token using speakeasy library
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      console.error('MFA verification failed');
      return next(new AppError('Invalid MFA code', 401));
    }

    // Issue JWT if MFA is verified
    const authToken = signToken({ id: user._id });
    res.status(200).json({
      status: 'success',
      authToken,
    });
  } catch (err) {
    return next(new AppError('Error verifying MFA', 500));
  }
};

exports.verifyMagicLink = async (req, res, next) => {
  const { token } = req.body;
  console.log('Token received:', token);

  // Verify token using JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    // if (decoded.type !== 'magic-link') {
    //   return next(new AppError('Invalid Magic link', 400));
    // }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    // Issue JWT for authenticated session
    const authToken = signToken({ id: decoded.id });
    res.status(200).json({
      status: 'success',
      authToken,
    });
  } catch (err) {
    console.error('Error decoding token:', err);
    return next(new AppError('Invalid or expired token', 400));
  }
};
