const Joi = require("joi");
const Boom = require("boom");

const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().required().description("User id, i.e. john-1"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createSongValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .description("Song title, i.e. Bohemian Rhapsody"),
    singer: Joi.string().required().description("Singer, i.e. Queen"),
    genre: Joi.string().required().description("Genre, i.e. Hard Rock"),
    duration: Joi.string().required().description("Duration, i.e. 05:55"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  idValidation,
  createSongValidation,
};
