// test-index.js
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app');

describe('Frontend Application', function() {
    beforeEach(function() {
        // Setup any necessary mocks or spies before each test
        this.sinon = sinon.createSandbox();
    });

    afterEach(function() {
        // Clean up after each test
        this.sinon.restore();
    });

    describe('Routes', function() {
        it('should respond to / with a 200 status', async function() {
            const response = await app.get('/');
            expect(response.status).to.equal(200);
        });

        it('should have the correct title on the homepage', async function() {
            const response = await app.get('/');
            const $ = await response.text();
            expect($('title').text()).to.include('Controller Pilot Data Link Communication');
        });
    });

    describe('API Endpoints', function() {
        it('should return data when fetching CPDLC information', async function() {
            const response = await app.post('/api/cpdlc', { method: 'getInfo' });
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body.data).to.exist;
        });

        it('should handle errors gracefully', async function() {
            const response = await app.get('/non-existing-route');
            expect(response.status).to.equal(404);
        });
    });

    // Add more tests for other parts of your frontend application
});
