const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'Success',
      result: users.length,
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'Success',
    message: 'welcome to all create user',
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'welcome to one User',
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'welcome to update User',
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'welcome to delete User',
  });
};
