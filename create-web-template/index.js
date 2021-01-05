'use strict';

const { getMongodbCollection } = require('../db/mongodb');
const utils = require('../utils');
const Promise = require('bluebird');
const errors = require('../errors');


module.exports = async (context, req) => {
    try {
        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to create a new web-template but the request body seems to be empty. Kindly pass the web-template to be created using request body in application/json format',
                    400
                )
            )
            return Promise.resolve()
        }
        await utils.validateUUIDField(context, `${req.body._id}`, 'The _id field specified in the request body does not match the UUID v4 format.');
        const collection = await getMongodbCollection('Merchants');
        const response = await collection.insertOne(Object.assign(
            {},
            req.body,
            {
                partitionKey: req.body._id,
                docType: 'webTemplate',
                createdDate: new Date(),
                updatedDate: new Date()
            }));
        if (response && response.ops) {
            context.res = {
                body: response.ops[0]
            };

        }
        return Promise.resolve();
    } catch (error) {
        utils.handleError(context, error);
    }
}