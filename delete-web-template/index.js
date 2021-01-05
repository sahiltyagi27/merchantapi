'use strict';

const { getMongodbCollection } = require('../db/mongodb');
const utils = require('../utils');
const errors = require('../errors');


module.exports = async (context, req) => {
    try {

        await utils.validateUUIDField(context, req.params.id, 'The id specified in the URL does not match the UUID v4 format.');

        const collection = await getMongodbCollection('Merchants');
        const result = await collection.findOne({
            _id: req.params.id,
            docType: 'webTemplate',
            partitionKey: req.params.id
        });

        let isAbleToDelete = false;
        if (!req.body)
            req.body = {};
        if (result && result.adminRights && Array.isArray(result.adminRights)) {
            for (let i = 0; i < result.adminRights.length; i++) {
                const element = result.adminRights[i];
                if (req.body.userMerchants.includes(element.merchantID) && (element.roles === 'admin' || element.roles === 'write')) {
                    isAbleToDelete = true;
                }
            }
        } else {
            utils.setContextResError(
                context,
                new errors.WebTemplateNotFoundError(
                    'The id specified in the URL doesn\'t exist.',
                    404
                )
            );
            return Promise.resolve();
        }
        if (!isAbleToDelete) {
            utils.setContextResError(
                context,
                new errors.MerchantNotAutherizedError(
                    'This merchant does not have permission to delete the site',
                    401
                )
            );
            return Promise.resolve();
        }

        const query = {
            docType: 'webTemplate',
            _id: req.params.id,
            partitionKey: req.params.id
        };

        const resp = await collection.deleteOne(query);
        if (resp && resp.deletedCount) {
            context.res = {
                body: {
                    code: 200,
                    description: 'Successfully deleted the specified web-template'
                }
            };
        } else {
            utils.setContextResError(
                context,
                new errors.WebTemplateNotFoundError(
                    'The webTemplate of specified details doesn\'t exist.',
                    404
                )
            );
        }

    } catch (error) {
        utils.handleError(context, error);
    }
};
