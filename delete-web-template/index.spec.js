'use strict';

const expect = require('chai').expect;
const helpers = require('../spec/helpers');
const request = require('request-promise');
const uuid = require('uuid');
const merchantID = uuid.v4();
const sampleWebTemplates = { ...require('../spec/sample-docs/WebTemplate'), _id: uuid.v4(),merchantID: uuid.v4() };
const { getMongodbCollection } = require('../db/mongodb');
sampleWebTemplates.adminRights = [
    {
        'merchantID': merchantID,
        'merchantName': 'Turistbutiken i Åre',
        'roles': 'admin'
    }
];

describe('Delete Web Template', () => {
    before(async () => {
        sampleWebTemplates.partitionKey = sampleWebTemplates._id;
        const collection = await getMongodbCollection('Merchants');
        await collection.insertOne(sampleWebTemplates);
    });

    it('should throw error on incorrect id field', async () => {
        try {
            await request.delete(`${helpers.API_URL}/api/v1/web-templates/123-abc`, {
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                }
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The id specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });

    it('should throw 404 error if the documentId is invalid', async () => {
        try {
            await request.delete(`${helpers.API_URL}/api/v1/web-templates/${uuid.v4()}`, {
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                }
            });
        } catch (error) {
            const response = {
                code: 404,
                description: 'The id specified in the URL doesn\'t exist.',
                reasonPhrase: 'WebTemplateNotFoundError'
            };

            expect(error.statusCode).to.equal(404);
            expect(error.error).to.eql(response);
        }
    });

    it('should delete the document when all validation passes', async () => {
        const response = await request
            .delete(`${helpers.API_URL}/api/v1/web-templates/${sampleWebTemplates._id}`, {
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                },
                body: { userMerchants: [ merchantID ]}
            });

        expect(response).not.to.be.null;
        expect(response).to.deep.equal({
            code: 200,
            description: 'Successfully deleted the specified web-template'
        });
    });
});