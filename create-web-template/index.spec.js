'use strict';

const expect = require('chai').expect;
const helpers = require('../spec/helpers');
const request = require('request-promise');
const uuid = require('uuid');
const sampleWebTemplates = { ...require('../spec/sample-docs/WebTemplate'), _id: uuid.v4(), merchantID: uuid.v4() };
const { getMongodbCollection } = require('../db/mongodb');
sampleWebTemplates.partitionKey = sampleWebTemplates._id;

describe('Create Web Template', () => {
    it('should throw error on incorrect id field', async () => {
        try {
            await request.post(`${helpers.API_URL}/api/v1/web-templates`, {
                body: { _id: 'abc-123' },
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                }
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The _id field specified in the request body does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });


    it('should create the document when all validation passes', async () => {
        const result = await request
            .post(`${helpers.API_URL}/api/v1/web-templates`, {
                body: sampleWebTemplates,
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                }
            });

        expect(result).not.to.be.null;
        expect(result._id).to.equal(sampleWebTemplates._id);
        expect(result.partitionKey).to.equal(sampleWebTemplates._id);
    });

    after(async () => {
        const collection = await getMongodbCollection('Merchants');
        await collection.deleteOne({ _id: sampleWebTemplates._id, docType: 'webTemplate', partitionKey: sampleWebTemplates._id });

    });
});