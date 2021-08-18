const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        throw new NotFoundError('Карточки не найдены');
      }
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndDelete(req.params.id)
          .then((deletedCard) => {
            if (!deletedCard) {
              throw new NotFoundError('Карточка не найдена');
            }
            res.send({ data: deletedCard });
          });
      } else {
        throw new ForbiddenError('Нет доступа к данным');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.statusCode === 403) {
        throw new ForbiddenError('Нет доступа к данным');
      }
      next();
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.statusCode === 404) {
        throw new NotFoundError('Карточка не найдена');
      }
      next();
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.statusCode === 404) {
        throw new NotFoundError('Карточка не найдена');
      }
      next();
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
