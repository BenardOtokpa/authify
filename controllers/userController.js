exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'welcome to all Users',
  });
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
