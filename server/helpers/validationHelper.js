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

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .description("User's username, i.e. john123"),
    fullname: Joi.string()
      .required()
      .description("User's full name, i.e. John Doe"),
    role: Joi.string()
      .required()
      .description("User's role, i.e. listener or artist"),
    password: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("User's password, should be 6-20 characters"),
    confirmPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .valid(Joi.ref("password"))
      .description("Should match user's password"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .description("User's username, i.e. john123"),
    password: Joi.string()
      .required()
      .min(6)
      .max(20)
      .description("User's password, should be 6-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const changePasswordValidation = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("User's old password, should be 6-20 characters"),
    newPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("User's new password, should be 6-20 characters"),
    confirmNewPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .valid(Joi.ref("newPassword"))
      .description("Should match user's new password"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .description("User's username, i.e. john123"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    newPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("User's new password, should be 6-20 characters"),
    confirmNewPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .valid(Joi.ref("newPassword"))
      .description("Should match user's new password"),
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
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
