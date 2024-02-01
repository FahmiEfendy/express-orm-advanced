const db = require("../../models");
const generalHelper = require("./generalHelper");

const fileName = "server/helpers/userHelper.js";

const getUserList = async () => {
  try {
    const data = await db.User.findAll();

    console.log([fileName, "GET All User", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET All User", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const getUserDetail = async (objectData) => {
  const { id } = objectData;

  try {
    const data = db.User.findOne({ where: { id: id } });
    // TODO: Add Properties List of Owned Playlists (playlists: [])

    console.log([fileName, "GET User Detail", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET User Detail", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postCreateUser = async (objectData) => {
  const { username, password } = objectData;

  try {
    const userList = await getUserList();

    const newData = db.User.build({
      id: `user-${userList.length + 1}`,
      username,
      password,
    });

    await newData.save();

    console.log([fileName, "POST Create User", "INFO"]);

    return Promise.resolve(newData);
  } catch (err) {
    console.log([fileName, "POST Create User", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const patchChangePassword = async (objectData) => {
  const { id, password } = objectData;

  try {
    const selectedUser = await db.User.findOne({ id: id });

    selectedUser.password = password;

    await selectedUser.save({ fields: ["password"] });

    await selectedUser.reload();

    console.log([fileName, "PATCH Change User Password", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "PATCH Change User Password", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const deleteRemoveUser = async (objectData) => {
  const { id } = objectData;

  try {
    await db.User.destroy({ where: { id: id } });

    console.log([fileName, "DELETE Remove User", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "DELETE Remove User", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

module.exports = {
  getUserList,
  getUserDetail,
  postCreateUser,
  patchChangePassword,
  deleteRemoveUser,
};
