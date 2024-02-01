const Router = require("express").Router();

const songHelper = require("../helpers/songHelper");
const validationHelper = require("../helpers/validationHelper");

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
    validationHelper.songRequestValidation(req.body);

    const response = await songHelper.postCreateSong(req.body);

    res
      .status(201)
      .send({ message: "Successfully Create New Song", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateSong = async (req, res) => {
  const { id } = req.params;
  const { title, singer, genre, duration } = req.body;

  const objectData = {
    id,
    title,
    singer,
    genre,
    duration,
  };

  try {
    validationHelper.idValidation(req.params);
    validationHelper.songRequestValidation(req.body, true);

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
    validationHelper.idValidation(req.params);

    await songHelper.deleteRemoveSong(req.params);

    res.status(200).send({ message: "Successfully Deleted a Song" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

Router.get("/", songList);
Router.get("/detail/:id", songDetail);
Router.post("/create", createSong);
Router.patch("/update/:id", updateSong);
Router.delete("/remove/:id", removeSong);

module.exports = Router;
