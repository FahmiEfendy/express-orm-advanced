const Router = require("express").Router();

const songHelper = require("../helpers/songHelper");
const validationHelper = require("../helpers/validationHelper");
const userMiddleware = require("../middlewares/userMiddleware");

const songList = async (req, res) => {
  try {
    const response = await songHelper.getSongList();

    res
      .status(200)
      .send({ message: "Successfully Get All Songs", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const songDetail = async (req, res) => {
  try {
    validationHelper.idValidation(req.params);

    const response = await songHelper.getSongDetail(req.params);

    res.status(200).send({
      message: `Successfully Get Song Detail with id of ${req.params.id}`,
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createSong = async (req, res) => {
  try {
    const validateData = {
      title: req.body.title,
      genre: req.body.genre,
      duration: req.body.duration,
    };

    validationHelper.songRequestValidation(validateData);

    const response = await songHelper.postCreateSong(req.body);

    res
      .status(201)
      .send({ message: "Successfully Create New Song", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateSong = async (req, res) => {
  const { id: song_id } = req.params;
  const { id, username, title, genre, duration } = req.body;

  const objectData = {
    id,
    username,
    song_id,
    title,
    genre,
    duration,
  };

  try {
    const validateData = {
      title: req.body.title,
      genre: req.body.genre,
      duration: req.body.duration,
    };

    validationHelper.idValidation({ id: song_id });
    validationHelper.songRequestValidation(validateData, true);

    const response = await songHelper.patchUpdateSong(objectData);

    res
      .status(200)
      .send({ message: "Successfully Update a Song", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const removeSong = async (req, res) => {
  try {
    const objectData = {
      id: req.body.id,
      username: req.body.username,
      song_id: req.params.id,
    };

    validationHelper.idValidation(req.params);

    await songHelper.deleteRemoveSong(objectData);

    res.status(200).send({ message: "Successfully Deleted a Song" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

Router.get("/", songList);
Router.get("/detail/:id", songDetail);
Router.post("/create", userMiddleware.tokenValidation, createSong);
Router.patch("/update/:id", userMiddleware.tokenValidation, updateSong);
Router.delete("/remove/:id", userMiddleware.tokenValidation, removeSong);

module.exports = Router;
