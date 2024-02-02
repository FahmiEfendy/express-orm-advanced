const Router = require("express").Router();

const userHelper = require("../helpers/userHelper");
const generalHelper = require("../helpers/generalHelper");
const validationHelper = require("../helpers/validationHelper");

const resgister = async (req, res) => {
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
    validationHelper.idValidation(req.params);

    const response = await userHelper.getUserDetail(req.params);

    res.status(200).send({
      message: `Successfully Get User Detail with id of ${req.params.id}`,
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const objectData = {
    id,
    password,
  };

  try {
    validationHelper.idValidation(req.params);
    validationHelper.updateUserValidation(req.body);

    const response = await userHelper.patchChangePassword(objectData);

    res
      .status(200)
      .send({ message: "Successfully Update a User", data: response });
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

Router.post("/register", resgister);
Router.post("/login", login);
Router.get("/", userList);
Router.get("/detail/:id", userDetail);
Router.patch("/change-password/:id", changePassword);
Router.delete("/remove/:id", removeUser);

module.exports = Router;
