const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BAD_REQUEST_STATUS_CODE, SERVER_ERROR_STATUS_CODE } = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.send({ data: users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: users });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash, about, avatar }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true }).send({ token });
    })
    .catch(next);
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { userAvatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { userAvatar }, { new: true, runValidators: true })
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

/* Метод для теста ошибок */

// const deleteUser = (req, res, next) => {
//   User.findByIdAndDelete(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Пользователь не найден');
//       }
//       res.send({ data: user });
//     })
//     .catch(next);
// };

module.exports = {
  getUsers,
  getUserById,
  // deleteUser,
  login,
  createUser,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
};
