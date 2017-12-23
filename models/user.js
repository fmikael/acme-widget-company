"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        activity: DataTypes.STRING,
        comment: DataTypes.STRING,
        email: DataTypes.STRING
    });

    return User;
};