const express = require('express');

const userController = require('./../controllers/userController');

const authController = require('./../controllers/authController');

const router = express.Router();

// Route to users data ;
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verifyMFA', authController.verifyMFA);
router.post('/verifyMagicLink', authController.verifyMagicLink);

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
