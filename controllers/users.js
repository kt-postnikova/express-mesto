const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const { NOT_FOUND_STATUS_CODE, BAD_REQUEST_STATUS_CODE, SERVER_ERROR_STATUS_CODE } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new mongoose.Error.DocumentNotFoundError();
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Пользователи не найдены' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        throw new mongoose.Error.DocumentNotFoundError();
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Отправлен некорректный запрос' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Пользователь не найден' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, email, password, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash, about, avatar }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new mongoose.Error.DocumentNotFoundError();
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new mongoose.Error.DocumentNotFoundError();
      }
      // res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Пользователь не зарегистрирован' });
      }
    });
};

// const deleteUser = (req, res) => {
//   User.findByIdAndDelete(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         throw new mongoose.Error.DocumentNotFoundError();
//       }
//       res.send({ data: card });
//     })
//     .catch((err) => {
//       if (err.name === 'DocumentNotFoundError') {
//         res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка не найдена' });
//       } else if (err.name === 'CastError') {
//         res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Отправлен некорректный запрос' });
//       } else {
//         res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
//       }
//     });
// };

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

module.exports = {
  getUsers,
  getUserById,
  // deleteUser,
  login,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
