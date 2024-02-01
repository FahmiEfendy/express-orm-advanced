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

const createPlaylistValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .description("Playlist name, i.e. Morning Music"),
    user_id: Joi.string().required().description("User id, i.e. john-1"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createUserValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .description("User username, i.e. JohnDoe"),
    password: Joi.string()
      .required()
      .description("User password, i.e. JohnDoe123"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .description("User password, i.e. JohnDoe456"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  idValidation,
  createSongValidation,
  createPlaylistValidation,
  createUserValidation,
  updateUserValidation,
};
