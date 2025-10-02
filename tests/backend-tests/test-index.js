// test-backend/index.js
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../../backend/app');

describe('Backend Application', function() {
    let server;

    beforeEach(function() {
        // Initialize the server before each test
        server = app.listen(3000);
    });

    afterEach(function() {
        // Clean up after each test
        server.close();
        this.sinon && this.sinon.restore();
    });

    describe('CPDLC Data Handling', function() {
        describe('GET /cpdlc-info', function() {
            it('should return CPDLC information when requested', async function() {
                const response = await app.get('/cpdlc-info');
                
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('object');
                expect(response.body.data).to.exist;
            });

            it('should handle errors gracefully when invalid data is requested', async function() {
                const response = await app.get('/cpdlc-info/invalid');
                
                expect(response.status).to.equal(500);
                expect(response.text()).to.include('Internal Server Error');
            });
        });

        describe('POST /cpdlc-data', function() {
            it('should process valid CPDLC data', async function() {
                const testData = { 
                    sender: 'TEST',
                    message: 'Hello World'
                };
                
                const response = await app.post('/cpdlc-data', testData);
                
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('object');
                expect(response.body.message).to.include('Data processed successfully');
            });

            it('should return errors for invalid CPDLC data', async function() {
                const invalidData = { 
                    sender: 'INVALID',
                    message: '' // Empty message
                };
                
                const response = await app.post('/cpdlc-data', invalidData);
                
                expect(response.status).to.equal(400);
                expect(response.text()).to.include('Invalid data format');
            });
        });
    });

    describe('Database Interaction', function() {
        it('should save CPDLC data to the database', async function() {
            const testData = { 
                sender: 'TEST',
                message: 'Hello World'
            };
            
            const response = await app.post('/cpdlc-data', testData);
            
            // Query the database to verify the data was saved correctly
            const dbResponse = await app.get('/cpdlc-data/saved');
            
            expect(dbResponse.status).to.equal(200);
            expect(dbResponse.body.data.length).to.be.above(0);
        });
    });

    describe('Authentication', function() {
        it('should authenticate successfully with valid credentials', async function() {
            const credentials = { 
                username: 'admin',
                password: 'password123'
            };
            
            const response = await app.post('/auth/login', credentials);
            
            expect(response.status).to.equal(200);
            expect(response.body.token).to.exist;
        });

        it('should return unauthorized error with invalid credentials', async function() {
            const invalidCredentials = { 
                username: 'invalid',
                password: 'wrongpass'
            };
            
            const response = await app.post('/auth/login', invalidCredentials);
            
            expect(response.status).to.equal(401);
            expect(response.text()).to.include('Unauthorized');
        });
    });
});
