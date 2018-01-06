'use strict';

const storage = require('../repositories/storage');
const db = require('../models');


exports.filterList = (folderId, userId) =>
    // Check if directory has 'read' permission
    storage.fileHasReadPermission(folderId, userId);

exports.filterUploadNew = (folderId, userId) =>
    // Check if directory has 'write' permission
    storage.fileHasWritePermission(folderId, userId);

exports.filterUploadRev = async (fileId, userId) => {

    /*
     * Check if directory has 'write' permission for metadata update
     * Check if file has 'write' permission for file update
     */

    const file = await db.File.findById(fileId);

    if (!file) {
        return false;
    }

    const lastData = await file.getData();

    if (!lastData) {
        console.log(`No data for file #${fileId}`);
    }


    return storage.fileHasWritePermission(lastData.dirId, userId);

};

exports.filterDownloadMeta = async (fileId, userId) => {

    // Check if directory has 'read' permissions for metadata download

    const file = await db.File.findById(fileId);

    if (!file) {
        console.log(`No file with id ${fileId}`);

        return false;
    }

    const lastData = await file.getData();

    if (!lastData) {
        console.log(`No data for file #${fileId}`);
    }

    return storage.fileHasReadPermission(lastData.dirId, userId);

};

exports.filterDownloadContents = (fileId, userId) => storage.fileHasReadPermission(fileId, userId);

exports.filterDelete = async (fileId, userId) => {

    // Check if directory has 'write' permission

    const file = await db.File.findById(fileId);

    if (!file) {
        return false;
    }

    const lastData = await file.getData();

    if (!lastData) {
        console.log(`No data for file #${fileId}`);
    }

    return storage.fileHasWritePermission(lastData.dirId, userId);
};
