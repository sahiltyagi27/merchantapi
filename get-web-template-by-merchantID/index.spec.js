'use strict';

const expect = require('chai').expect;
const helpers = require('../spec/helpers');
const request = require('request-promise');
const uuid = require('uuid');
const merchantID = uuid.v4();
const sampleWebTemplates = { ...require('../spec/sample-docs/WebTemplate'), _id: uuid.v4(), merchantID: merchantID };
const { getMongodbCollection } = require('../db/mongodb');
sampleWebTemplates.adminRights = [
    {
        'merchantID': merchantID,
        'merchantName': 'Turistbutiken i Åre',
        'roles': 'admin'
    }
];

describe('Get Web Template', () => {
    before(async () => {
        sampleWebTemplates.partitionKey = sampleWebTemplates._id;
        const collection = await getMongodbCollection('Merchants');
        await collection.insertOne(sampleWebTemplates);
    });

    it('should throw error on incorrect id field', async () => {
        try {
            await request.get(`${helpers.API_URL}/api/v1/merchants/123-abc/web-templates`, {
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
            await request.get(`${helpers.API_URL}/api/v1/merchants/${uuid.v4()}/web-templates`, {
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

    it('should return the document when all validation passes', async () => {
        const response = await request.get(`${helpers.API_URL}/api/v1/merchants/${sampleWebTemplates.merchantID}/web-templates/`, {
            json: true,
            headers: {
                'x-functions-key': process.env.X_FUNCTIONS_KEY
            }
        });

        expect(response).not.to.be.null;
    });
    after(async () => {
        const collection = await getMongodbCollection('Merchants');
        await collection.deleteOne({ _id: sampleWebTemplates._id, docType: 'webTemplate', partitionKey: sampleWebTemplates._id });

    });
});