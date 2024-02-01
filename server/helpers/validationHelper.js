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

const songRequestValidation = (data, isUpdate = false) => {
  const schema = Joi.object({
    title: isUpdate
      ? Joi.string()
          .optional()
          .description("Song title, i.e. Bohemian Rhapsody")
      : Joi.string()
          .required()
          .description("Song title, i.e. Bohemian Rhapsody"),
    singer: isUpdate
      ? Joi.string().optional().description("Singer, i.e. Queen")
      : Joi.string().required().description("Singer, i.e. Queen"),
    genre: isUpdate
      ? Joi.string().optional().description("Genre, i.e. Hard Rock")
      : Joi.string().required().description("Genre, i.e. Hard Rock"),
    duration: isUpdate
      ? Joi.string().optional().description("Duration, i.e. 05:55")
      : Joi.string().required().description("Duration, i.e. 05:55"),
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

const updatePlaylistValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .optional()
      .description("Playlist name, i.e. Morning Music"),
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
  songRequestValidation,
  createPlaylistValidation,
  updatePlaylistValidation,
  createUserValidation,
  updateUserValidation,
};
