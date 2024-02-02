const Router = require("express").Router();

const userHelper = require("../helpers/userHelper");
const generalHelper = require("../helpers/generalHelper");
const validationHelper = require("../helpers/validationHelper");
const userMiddleware = require("../middlewares/userMiddleware");

const register = async (req, res) => {
  const { username, fullname, password, role } = req.body;

  try {
    validationHelper.registerValidation(req.body);

    const response = await userHelper.postRegister({
      username,
      fullname,
      role,
      password,
    });

    res
      .status(201)
      .send({ message: "Successfully Create New User", data: response });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(generalHelper.errorResponse(err).output.payload);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    validationHelper.loginValidation(req.body);

    const response = await userHelper.postLogin({ username, password });

    res.status(200).send({ message: "Successfully Login", data: response });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(generalHelper.errorResponse(err).output.payload);
  }
};

const userList = async (req, res) => {
  try {
    const response = await userHelper.getUserList();

    res
      .status(200)
      .send({ message: "Successfully Get All Users", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const userDetail = async (req, res) => {
  try {
    const response = await userHelper.getUserDetail(req.body);

    res.status(200).send({
      message: `Successfully Get User Detail`,
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const validateData = {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmNewPassword: req.body.confirmNewPassword,
    };

    validationHelper.changePasswordValidation(validateData);

    const response = await userHelper.patchChangePassword(req.body);

    res
      .status(200)
      .send({ message: "Successfully Update a User", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    validationHelper.forgotPasswordValidation(req.body);

    const response = await userHelper.postForgotPassword(req.body);

    res.status(200).send({
      message: "Successfully Request Reset Password!",
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const validateData = {
      newPassword: req.body.newPassword,
      confirmNewPassword: req.body.confirmNewPassword,
    };

    validationHelper.resetPasswordValidation(validateData);

    const response = await userHelper.postResetPassword(req.body);

    res.status(200).send({
      message: "Successfully Change Password",
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const removeUser = async (req, res) => {
  try {
    validationHelper.idValidation(req.params);

    await userHelper.deleteRemoveUser(req.params);

    res.status(200).send({ message: "Successfully Deleted a User" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

Router.post("/register", register);
Router.post("/login", login);
Router.get("/", userList);
Router.get("/detail", userMiddleware.tokenValidation, userDetail);
Router.patch(
  "/change-password",
  userMiddleware.tokenValidation,
  changePassword
);
Router.post("/forgot-password", forgotPassword);
Router.post(
  "/reset-password/:token",
  userMiddleware.tokenValidation,
  resetPassword
);
Router.delete("/remove/:id", removeUser);

module.exports = Router;
