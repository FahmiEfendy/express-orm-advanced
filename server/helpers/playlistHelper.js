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
    const data = await db.Playlist.findOne({ where: { id: id } });
    // TODO: Add Properties List of Stored Song (songs: [])

    const formattedData = {
      ...data.dataValues,
      total_song: data.dataValues.songs || 0,
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
    // TODO: Fix songs properties (not shown)
    const newData = db.Playlist.build({
      id: `playlist-${playlistList.length + 1}`,
      name,
      songs: [],
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

module.exports = {
  getPlaylistList,
  getPlaylistDetail,
  postCreatePlaylist,
  deleteRemovePlaylist,
};
