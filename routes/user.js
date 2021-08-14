const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  // deleteUser,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUserInfo);
usersRouter.get('/users/:userId', getUserById);
// usersRouter.delete('/users/:userId', deleteUser);
usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
