const Card = require('../models/card');
const { NOT_FOUND_STATUS_CODE, BAD_REQUEST_STATUS_CODE, SERVER_ERROR_STATUS_CODE } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточки не найдены' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Карточка не найдена' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((like) => res.send({ data: like }))
    .catch(() => res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' }));
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((like) => res.send({ data: like }))
    .catch(() => res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};