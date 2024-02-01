const Router = require("express").Router();

const songHelper = require("../helpers/songHelper");

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

Router.get("/", songList);

module.exports = Router;
