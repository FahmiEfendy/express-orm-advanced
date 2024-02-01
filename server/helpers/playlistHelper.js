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
  const { name, user_id } = objectData;

  const playlistList = await getPlaylistList();

  try {
    const newData = db.Playlist.build({
      id: `playlist-${playlistList.length + 1}`,
      name,
      user_id,
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
  const { id, name } = objectData;

  try {
    const selectedPlaylist = await db.Playlist.findOne({ id: id });

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
  const { id } = objectData;

  try {
    await db.Playlist.destroy({ where: { id: id } });

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
  const { playlist_id, song_id } = objectData;

  try {
    const selectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

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
  const { playlist_id, song_id } = objectData;

  try {
    const selectedPlaylist = await db.Playlist.findOne({
      where: { id: playlist_id },
    });

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
