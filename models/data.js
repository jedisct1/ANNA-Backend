'use strict';


let computeValues = (data, options) => {
    const Storage = require('../repositories/Storage');

    data.getPath()
        .then(path => Storage.computeType(path))
        .then(type => data.type = type)
        .catch(err => data.type = "")

    data.getPath()
        .then(path => Storage.computeSize(path))
        .then(size => data.size = size)
        .catch(err => data.size = NaN)
};

module.exports = (sequelize, DataTypes) => {

    const Data = sequelize.define('Data', {
        name: {allowNull: false, type: DataTypes.STRING},
        type: {allowNull: true, type: DataTypes.STRING},
        size: {allowNull: true, type: DataTypes.INTEGER},
        exists: {allowNull: false, defaultValue: true, type: DataTypes.BOOLEAN},
        fileId: {allowNull: false, type: DataTypes.INTEGER},
        dirId: {allowNull: false, defaultValue: 1, type: DataTypes.INTEGER},
        ownerId: {allowNull: false, type: DataTypes.INTEGER},
        rightsId: {allowNull: false, type: DataTypes.INTEGER},
        groupId: {allowNull: false, type: DataTypes.INTEGER},

        isDir: DataTypes.VIRTUAL,
        children: DataTypes.VIRTUAL,
    }, {
        timestamps: true,
        hooks: {
            beforeCreate: computeValues,
            beforeUpdate: computeValues
        }
    });


    Data.associate = function (models) {
        Data.belongsTo(models.File, {foreignKey: 'fileId', as: 'file'});
        Data.belongsTo(models.User, {foreignKey: 'ownerId', as: 'author'});
        Data.belongsTo(models.Right, {foreignKey: 'rightsId', as: 'rights'});
        Data.belongsTo(models.Group, {foreignKey: 'groupId', as: 'group'});

        Data.belongsTo(models.Data, {foreignKey: 'dirId', as: 'directory'});
        Data.hasMany(models.Data, {foreignKey: 'dirId', as: 'files'});
    };



    const Storage = require('../repositories/Storage');

    Data.prototype.getRights = Storage.getDataRights;
    Data.prototype.getPath = Storage.getDataPath;
    Data.prototype.getUrl = Storage.getDataUrl;

    return Data;
};
