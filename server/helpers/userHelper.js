const _ = require("lodash");
const Boom = require("boom");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const generalHelper = require("./generalHelper");

const salt = bcrypt.genSaltSync(10);
const fileName = "server/helpers/userHelper.js";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "MUSIC_SERVICE_KEY";

const __hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const __comparePassword = (payloadPass, dbPass) => {
  return bcrypt.compareSync(payloadPass, dbPass);
};

const __generateToken = (data) => {
  return jwt.sign(data, jwtSecretToken, { expiresIn: jwtExpiresIn });
};

const getUserList = async () => {
  try {
    const data = await db.User.findAll();

    console.log([fileName, "GET All User", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET All User", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const getUserDetail = async (objectData) => {
  const { id, username } = objectData;

  try {
    const selectedUser = await db.User.findOne({
      where: { id, username },
      attributes: { exclude: ["password"] },
      include: {
        model: db.Playlist,
        as: "playlists",
        attributes: ["id", "name"],
      },
    });

    if (_.isEmpty(selectedUser)) {
      throw Boom.badRequest(`User with username ${username} does not found!`);
    }

    console.log([fileName, "GET User Detail", "INFO"]);

    return Promise.resolve(selectedUser);
  } catch (err) {
    console.log([fileName, "GET User Detail", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postRegister = async (objectData) => {
  const { username, fullname, password, role } = objectData;

  try {
    const userExist = await db.User.findOne({ where: { username } });

    if (!_.isEmpty(userExist)) {
      throw Boom.badRequest(`User with username ${username} already exist!`);
    }

    const userList = await getUserList();
    const hashedPassword = __hashPassword(password);

    const newUser = await db.User.create({
      id: `user-${userList.length + 1}`,
      username,
      fullname,
      password: hashedPassword,
      role,
    });

    console.log([fileName, "POST Register", "INFO"]);

    return Promise.resolve(newUser);
  } catch (err) {
    console.log([fileName, "POST Register", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postLogin = async (objectData) => {
  const { username, password } = objectData;

  try {
    const selectedUser = await db.User.findOne({ where: { username } });

    if (_.isEmpty(selectedUser)) {
      throw Boom.badRequest(`User with username ${username} not found!`);
    }

    const isPasswordMatched = __comparePassword(
      password,
      selectedUser.password
    );

    if (!isPasswordMatched) {
      throw Boom.badRequest(`Invalid password!`);
    }

    const token = __generateToken({
      id: selectedUser.id,
      username: selectedUser.username,
      role: selectedUser.role,
    });

    console.log([fileName, "POST Login", "INFO"]);

    return Promise.resolve({ token });
  } catch (err) {
    console.log([fileName, "POST Login", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const patchChangePassword = async (objectData) => {
  const { id, username, oldPassword, newPassword } = objectData;

  try {
    const selectedUser = await db.User.findOne({ id, username });

    if (_.isEmpty(selectedUser)) {
      throw Boom.badRequest(`User with username ${username} not found!`);
    }

    const isPasswordMatched = __comparePassword(
      oldPassword,
      selectedUser.password
    );

    if (!isPasswordMatched) {
      throw Boom.badRequest(`Invalid old password!`);
    }

    const hashedNewPassword = __hashPassword(newPassword);

    selectedUser.password = hashedNewPassword;

    await selectedUser.save({ fields: ["password"] });

    await selectedUser.reload();

    console.log([fileName, "PATCH Change User Password", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "PATCH Change User Password", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postForgotPassword = async (objectData) => {
  const { username } = objectData;

  try {
    const selectedUser = await db.User.findOne({ where: { username } });

    if (_.isEmpty(selectedUser)) {
      throw Boom.badRequest(`There is no user with username ${username}`);
    }

    const token = __generateToken({
      id: selectedUser.id,
    });

    console.log([fileName, "GET Reset Password", "INFO"]);

    return Promise.resolve({ token });
  } catch (err) {
    console.log([fileName, "GET Reset Password", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postResetPassword = async (objectData) => {
  const { id, username, newPassword } = objectData;

  try {
    const selectedUser = await db.User.findOne({ id, username });

    if (_.isEmpty(selectedUser)) {
      throw Boom.badRequest(`User with username ${username} not found!`);
    }

    const hashedNewPassword = __hashPassword(newPassword);

    selectedUser.password = hashedNewPassword;

    await selectedUser.save({ fields: ["password"] });

    await selectedUser.reload();

    console.log([fileName, "POST Reset Password", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "POST Reset Password", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const deleteRemoveUser = async (objectData) => {
  const { id, username } = objectData;

  try {
    const selectedUser = await db.User.findOne({ where: { id, username } });

    if (_.isEmpty(selectedUser)) {
      throw Boom.badRequest(`User with username ${username} not found!`);
    }

    await db.User.destroy({ where: { id: id } });

    console.log([fileName, "DELETE Remove User", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "DELETE Remove User", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

module.exports = {
  getUserList,
  getUserDetail,
  postRegister,
  postLogin,
  patchChangePassword,
  postForgotPassword,
  postResetPassword,
  deleteRemoveUser,
};
