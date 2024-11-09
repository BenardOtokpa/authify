const bcrypt =require('bcrypt');

const User = require('./../models/userModel')



exports.signup = async (req, res) => {
  try {
    const {email, password} = req.body

  const hashedPassword = await bcrypt.hash(password, 12 )
  const newUser = await User.create({email, password: hashedPassword})
  res.status(201).json({
    status: 'success',
    data:{
        user: newUser
    }
  })
  } catch (err) {
    res.status(400).json({
        status: 'fail',
        message: err
    })
  }
}
