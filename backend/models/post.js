"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: "user_id" });
      Post.hasMany(models.Comment, { foreignKey: "post_id" });
      Post.hasMany(models.Like, { foreignKey: "post_id" });
    }
  }
  Post.init(
    {
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Post",
    },
  );
  return Post;
};
