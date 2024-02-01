"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
      Playlist.belongsToMany(models.Song, {
        through: "PlaylistSongs",
        foreignKey: "playlist_id",
        otherKey: "song_id",
        as: "songs",
      });
    }

    get total_song() {
      return this.getDataValue("songs") ? this.getDataValue("songs").length : 0;
    }
  }
  Playlist.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Playlist",
    }
  );
  return Playlist;
};
