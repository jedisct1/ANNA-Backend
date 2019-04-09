'use strict';

const policy = require('../storage_policy');
const winston = require('winston');


module.exports = (db) => async (req, res) => {

    // Escape req.body strings
    req.transaction.logger.info('Escaping req.body strings')
    Object.keys(req.body).map((key) => {
        if (typeof req.body[key] === 'string') {
            req.body[key] = encodeURI(req.body[key]);
        }

        return true;
    });

    // Check folderId
    const dirId = parseInt(req.body.dirId, 10);

    // Create the file and its data
    req.transaction.logger.info('Checking upload policies');
    const allowed = await policy.filterUploadNew(req.transaction, dirId);
    if (!allowed) {
        req.transaction.logger.info('Upload refused by policies');
        throw res.boom.unauthorized();
    }

    transaction.filePath = '';
    if (req.file) {
        req.transaction.logger.info('Reading file path');
        transaction.filePath = req.file.path;
    }

    req.transaction.logger.info('Creating file')
    const data = await db.File.createNew(req.transaction);

    req.transaction.logger.info('Sending created data');
    return res.status(200).json(data);
};
