const Router = require("express").Router();

const playlistHelper = require("../helpers/playlistHelper");
const validationHelper = require("../helpers/validationHelper");
const userMiddleware = require("../middlewares/userMiddleware");

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
    validationHelper.playlistRequestValidation({ name: req.body.name });

    const response = await playlistHelper.postCreatePlaylist(req.body);

    res
      .status(201)
      .send({ message: "Successfully Create New Playlist", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updatePlaylist = async (req, res) => {
  const { id: playlist_id } = req.params;
  const { id, username, name } = req.body;

  const objectData = {
    id,
    username,
    playlist_id,
    name,
  };

  try {
    validationHelper.idValidation({ id: playlist_id });
    validationHelper.playlistRequestValidation({ name: req.body.name }, true);

    const response = await playlistHelper.patchUpdatePlaylist(objectData);

    res
      .status(201)
      .send({ message: "Successfully Update a Playlist", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const removePlaylist = async (req, res) => {
  try {
    const objectData = {
      id: req.body.id,
      username: req.body.username,
      playlist_id: req.params.id,
    };

    validationHelper.idValidation(req.params);

    await playlistHelper.deleteRemovePlaylist(objectData);

    res.status(200).send({ message: "Successfully Deleted a Playlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const addSongToPlaylist = async (req, res) => {
  const objectData = {
    id: req.body.id,
    username: req.body.username,
    playlist_id: req.params.id,
    song_id: req.body.song_id,
  };

  try {
    validationHelper.idValidation(req.params);
    validationHelper.idValidation({ id: req.body.song_id });

    const response = await playlistHelper.postAddSongToPlaylist(objectData);

    res.status(200).send({
      message: "Successfully Added a Song to Playlist",
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  const objectData = {
    id: req.body.id,
    username: req.body.username,
    playlist_id: req.params.id,
    song_id: req.body.song_id,
  };

  try {
    validationHelper.idValidation(req.params);
    validationHelper.idValidation({ id: objectData.song_id });

    const response = await playlistHelper.deleteRemoveSongFromPlaylist(
      objectData
    );

    res.status(200).send({
      message: "Successfully Removed a Song from Playlist",
      data: response,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

Router.get("/", playlistList);
Router.get("/detail/:id", playlistDetail);
Router.post("/create", userMiddleware.tokenValidation, createPlaylist);
Router.patch("/update/:id", userMiddleware.tokenValidation, updatePlaylist);
Router.delete("/remove/:id", userMiddleware.tokenValidation, removePlaylist);
Router.post("/add-song/:id", userMiddleware.tokenValidation, addSongToPlaylist);
Router.delete(
  "/remove-song/:id",
  userMiddleware.tokenValidation,
  removeSongFromPlaylist
);

module.exports = Router;
