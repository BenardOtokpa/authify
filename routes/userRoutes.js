const express = require('express');

const userController = require('./../controllers/userController');

const authCOntroller = require('./../controllers/authController');

const router = express.Router();

// Route to users data ;
router.post('/signup', authCOntroller.signup)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);


router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
