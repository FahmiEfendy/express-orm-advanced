const db = require("../../models");
const generalHelper = require("./generalHelper");

const fileName = "server/helpers/songHelper.js";

const getSongList = async () => {
  try {
    const data = await db.Song.findAll();

    console.log([fileName, "GET All Song", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET All Song", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

module.exports = {
  getSongList,
};
