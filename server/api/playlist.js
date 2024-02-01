const Router = require("express").Router();

const playlistHelper = require("../helpers/playlistHelper");
const validationHelper = require("../helpers/validationHelper");

const playlistList = async (req, res) => {
  try {
    const response = await playlistHelper.getPlaylistList();

    res
      .status(200)
      .send({ message: "Successfully Get All Playlists", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const playlistDetail = async (req, res) => {
  try {
    validationHelper.idValidation(req.params);

    const response = await playlistHelper.getPlaylistDetail(req.params);

    res.status(200).send({
      message: `Successfully Get Playlist Detail with id of ${req.params.id}`,
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createPlaylist = async (req, res) => {
  try {
    validationHelper.createPlaylistValidation(req.body);

    const response = await playlistHelper.postCreatePlaylist(req.body);

    res
      .status(201)
      .send({ message: "Successfully Create New Playlist", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const removePlaylist = async (req, res) => {
  try {
    validationHelper.idValidation(req.params);

    await playlistHelper.deleteRemovePlaylist(req.params);

    res.status(200).send({ message: "Successfully Deleted a Playlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

Router.get("/", playlistList);
Router.get("/detail/:id", playlistDetail);
Router.post("/create", createPlaylist);
Router.delete("/remove/:id", removePlaylist);
// TODO: Patch Update Playlist
// TODO: Add and Remove Playlist's Song

module.exports = Router;
