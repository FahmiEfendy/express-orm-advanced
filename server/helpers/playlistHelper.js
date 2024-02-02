const _ = require("lodash");
const Boom = require("boom");

const db = require("../../models");
const generalHelper = require("./generalHelper");

const fileName = "server/helpers/playlistHelper.js";

const getPlaylistList = async () => {
  try {
    const data = await db.Playlist.findAll();

    console.log([fileName, "GET All Playlist", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET All Playlist", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const getPlaylistDetail = async (objectData) => {
  const { id } = objectData;

  try {
    const data = await db.Playlist.findOne({
      where: { id: id },
      include: {
        model: db.Song,
        as: "songs",
        attributes: ["id", "title", "singer"],
        through: { attributes: [] },
      },
    });

    if (_.isEmpty(data)) {
      throw Boom.notFound(`Playlist with id of ${id} does not exist!`);
    }

    const formattedData = {
      ...data.dataValues,
      total_song: data.total_song,
    };

    console.log([fileName, "GET Playlist Detail", "INFO"]);

    return Promise.resolve(formattedData);
  } catch (err) {
    console.log([fileName, "GET Playlist Detail", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postCreatePlaylist = async (objectData) => {
  const { id, username, name } = objectData;

  const playlistList = await getPlaylistList();

  try {
    const selectedUser = await db.User.findOne({
      where: { id, username },
    });

    if (_.isEmpty(selectedUser)) {
      throw Boom.unauthorized("You must login first to create a playlist!");
    }

    const newData = db.Playlist.build({
      id: `playlist-${playlistList.length + 1}`,
      name,
      user_id: id,
    });

    await newData.save();

    console.log([fileName, "POST Create Playlist", "INFO"]);

    return Promise.resolve(newData);
  } catch (err) {
    console.log([fileName, "POST Create Playlist", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const patchUpdatePlaylist = async (objectData) => {
  const { id, username, playlist_id, name } = objectData;

  try {
    const selectedUser = await db.User.findOne({
      where: { id, username },
    });

    if (_.isEmpty(selectedUser)) {
      throw Boom.unauthorized("You dont have access to update this playlist!");
    }

    const selectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

    if (_.isEmpty(selectedPlaylist)) {
      throw Boom.notFound(`Playlist with name of ${name} didn't exist!`);
    }

    selectedPlaylist.name = name || selectedPlaylist.name;

    await selectedPlaylist.save({ fields: ["name"] });

    await selectedPlaylist.reload();

    console.log([fileName, "PATCH Update Playlist", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "PATCH Update Playlist", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const deleteRemovePlaylist = async (objectData) => {
  const { id, username, playlist_id } = objectData;

  try {
    const selectedUser = await db.User.findOne({
      where: { id, username },
    });

    if (_.isEmpty(selectedUser)) {
      throw Boom.unauthorized("You dont have access to delete this song!");
    }

    const selectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

    if (_.isEmpty(selectedPlaylist)) {
      throw Boom.notFound(`Playlist with id of ${playlist_id} does not exist!`);
    }

    await db.Playlist.destroy({ where: { id: playlist_id } });

    console.log([fileName, "DELETE Remove Playlist", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "DELETE Remove Playlist", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postAddSongToPlaylist = async (objectData) => {
  const { id, username, playlist_id, song_id } = objectData;

  try {
    const selectedUser = await db.User.findOne({
      where: { id, username },
    });

    if (_.isEmpty(selectedUser)) {
      throw Boom.unauthorized(
        "You must login first to add a song to playlist!"
      );
    }

    const selectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

    if (_.isEmpty(selectedPlaylist)) {
      throw Boom.notFound(`Playlist with id of ${playlist_id} didn't exist!`);
    }

    const selectedSong = await db.Song.findOne({
      where: { id: song_id },
    });

    if (_.isEmpty(selectedSong)) {
      throw Boom.notFound(`Song with id of ${song_id} didn't exist!`);
    }

    const songExistInPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
      include: {
        model: db.Song,
        as: "songs",
        where: { id: song_id },
      },
    });

    if (!_.isEmpty(songExistInPlaylist)) {
      throw Boom.notFound(
        `Song with id of${song_id} already exist in playlist with id of ${playlist_id}!`
      );
    }

    await selectedPlaylist.addSong(song_id);

    await selectedPlaylist.reload();

    const updatedSelectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

    console.log([fileName, "POST Add Song To Playlist", "INFO"]);

    return Promise.resolve(updatedSelectedPlaylist);
  } catch (err) {
    console.log([fileName, "POST Add Song To Playlist", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const deleteRemoveSongFromPlaylist = async (objectData) => {
  const { id, username, playlist_id, song_id } = objectData;

  try {
    const selectedUser = await db.User.findOne({
      where: { id, username },
    });

    if (_.isEmpty(selectedUser)) {
      throw Boom.unauthorized(
        "You must login first to delete a song from this playlist!"
      );
    }

    const selectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

    if (_.isEmpty(selectedPlaylist)) {
      throw Boom.notFound(`Playlist with id of ${playlist_id} didn't exist!`);
    }

    const songExistInPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
      include: {
        model: db.Song,
        as: "songs",
        where: { id: song_id },
      },
    });

    if (_.isEmpty(songExistInPlaylist)) {
      throw Boom.notFound(
        `No song with id of ${song_id} exist in playlist with id of ${playlist_id}!`
      );
    }

    await selectedPlaylist.removeSong(song_id);

    await selectedPlaylist.reload();

    const updatedSelectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

    console.log([fileName, "DELETE Remove a Song from Playlist", "INFO"]);

    return Promise.resolve(updatedSelectedPlaylist);
  } catch (err) {
    console.log([fileName, "DELETE Remove a Song from Playlist", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

module.exports = {
  getPlaylistList,
  getPlaylistDetail,
  postCreatePlaylist,
  patchUpdatePlaylist,
  deleteRemovePlaylist,
  postAddSongToPlaylist,
  deleteRemoveSongFromPlaylist,
};
