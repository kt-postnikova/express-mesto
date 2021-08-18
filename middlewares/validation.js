const { celebrate, Joi } = require('celebrate');

const linkRegEx = /(http|https):\/\/(www)*[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#*/;

const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegEx),
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
    avatar: Joi.string().pattern(linkRegEx),
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
