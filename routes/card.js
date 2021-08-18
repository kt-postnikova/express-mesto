const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');
const { cardValidator, idValidator } = require('../middlewares/validation');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', cardValidator, createCard);
cardsRouter.delete('/cards/:id', idValidator, deleteCard);
cardsRouter.put('/cards/:id/likes', idValidator, putLike);
cardsRouter.delete('/cards/:id/likes', idValidator, deleteLike);

module.exports = cardsRouter;
