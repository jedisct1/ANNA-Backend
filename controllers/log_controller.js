'use strict';

/**
 * @file Manages logs
 * @see {@link module:log}
 */

/**
 * @module log
 */

const db = require('../models');

/**
 *
 * Get all existing logs.
 *
 * @function index
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 * @param {Object} handle - The error handling function.
 *
 * @returns {Object} Promise.
 *
 * @memberof module:log
 * @inner
 *
 */
exports.index = function (req, res, handle) {
    return db.Log.findAll({include: ['author']})
        .then((logs) => res.status(200).json(logs))
        .catch((err) => handle(err));
};

/**
 *
 * Get a single log.
 *
 * @function show
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 * @param {Object} handle - the error handling function.
 *
 * @returns {Object} promise
 *
 * @memberof module:log
 * @inner
 *
 */
exports.show = function (req, res, handle) {
    if (typeof req.params.logId !== 'number') {

        return handle(res.boom.badRequest());
    }

    return db.Log.findOne({
        where: {id: req.params.logId},
        include: ['author']
    })
        .then((log) => {
            if (log) {
                return res.status(200).json(log);
            }
            throw res.boom.notFound();

        })
        .catch((err) => handle(err));
};

/**
 *
 * Create a new log and store it.
 *
 * @function store
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 * @param {Object} handle - The error handling function.
 *
 * @returns {Object} promise
 *
 * @memberof module:log
 * @inner
 *
 */
exports.store = function (req, res, handle) {
    return db.Log.create(req.body)
        .then((log) => res.status(201).json(log))
        .catch(db.Sequelize.ValidationError, () => res.boom.badRequest())
        .catch((err) => handle(err));
};

/**
 *LOg
 * Updates an existing log.
 *
 * @function update
 *
 * @param {obj} req     - the user request
 * @param {obj} res     - the response to be sent
 * @param {obj} handle  - the error handling function
 *
 * @returns {Object} promise
 *
 * @memberof module:log
 * @inner
 *
 */
exports.update = function (req, res, handle) {
    if (typeof req.params.logId !== 'number') {

        return handle(res.boom.badRequest());
    }

    return db.Log.update(req.body, {where: {id: req.params.logId}})
        .then(() => res.status(204).json({}))
        .catch((err) => handle(err));
};

/**
 *
 * Deletes an existing log.
 *
 *@function delete
 *
 * @param {obj} req     - the user request
 * @param {obj} res     - the response to be sent
 * @param {obj} handle  - the error handling function
 *
 * @returns {Object} promise
 *
 * @memberof module:log
 * @inner
 *
 */
exports.delete = function (req, res, handle) {
    if (typeof req.params.logId !== 'number') {

        throw res.boom.badRequest();
    }

    db.Log.destroy({where: {id: req.params.logId}})
        .then((data) => {
            if (!data[0]) {
                throw res.boom.badImplementation('Missing data !');
            }

            if (data[0] === 1) {
                return res.status(204).json({});
            } else if (data[0] === 0) {
                throw res.boom.notFound();
            } else {
                throw res.boom.badImplementation('Too many rows deleted !');
            }
        })
        .catch((err) => handle(err));
};
