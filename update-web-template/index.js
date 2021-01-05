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
        let isAbleToUpdate = false;
        if (!req.body)
            req.body = {};
        if (result && result.adminRights && Array.isArray(result.adminRights)) {
            for (let i = 0; i < result.adminRights.length; i++) {
                const element = result.adminRights[i];
                if (req.body.userMerchants.includes(element.merchantID) && (element.roles === 'admin' || element.roles === 'write')) {
                    isAbleToUpdate = true;
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

        if (!isAbleToUpdate) {
            utils.setContextResError(
                context,
                new errors.MerchantNotAutherizedError(
                    'This merchant does not have permission to delete the site',
                    401
                )
            );
            return Promise.resolve();
        }
        
        const resp = await collection.updateOne({
            _id: req.params.id,
            docType: 'webTemplate',
            partitionKey: req.params.id
        }, {
            $set: Object.assign(
                {},
                req.body.updatedWebTemplate,
                {
                    updatedDate: new Date()
                }
            )
        });

        if (resp && resp.matchedCount) {
            context.res = {
                body: {
                    code: 200,
                    description: 'Successfully update the specified web-template'
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
