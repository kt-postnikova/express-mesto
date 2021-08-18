const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const urlCheck = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('Переданы некорректные данные');
};

const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlCheck),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const registrationValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlCheck),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const idValidator = celebrate(
  { params: Joi.object().keys({ id: Joi.string().alphanum().length(24).hex() }) },
);

module.exports = {
  cardValidator,
  idValidator,
  loginValidator,
  registrationValidator,
};
