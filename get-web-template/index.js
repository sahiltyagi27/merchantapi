'use strict';

const { getMongodbCollection } = require('../db/mongodb');
const utils = require('../utils');
const errors = require('../errors');


module.exports = async (context, req) => {
    try {
        
        await utils.validateUUIDField(context, req.params.id, 'The id specified in the URL does not match the UUID v4 format.');
        
        const query = {
            docType: 'webTemplate',
            _id: req.params.id,
            partitionKey: req.params.id
        };

        const collection = await getMongodbCollection('Merchants');

        const webTemplate = await collection.findOne(query);
        if (webTemplate) {
            context.res = {
                body: webTemplate
            };
        } else {
            utils.setContextResError(
                context,
                new errors.WebTemplateNotFoundError(
                    'The id specified in the URL doesn\'t exist.',
                    404
                )
            );
        }

    } catch (error) {
        utils.handleError(context, error);
    }
};
