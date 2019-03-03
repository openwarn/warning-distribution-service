const express = require('express');
const process = require('process');
const app = require('./app');
const request = require('supertest');
const HttpStatus = require('statuses');

// Helper function to combine supertest with jasmine
function jasminify(err, done) {
    if (err) {
        done.fail(err)
    } else {
        done(); 
    }
}

describe('app', () => {
    const TEST_PORT = 7002;
    let expressApp = express();

    beforeAll(() => {
        process.env.PORT = TEST_PORT;
        expressApp = app.start();
    });

    it('should provide health endpoint', (done) => {
        request(expressApp).get('/health')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(HttpStatus('OK'))
            .end((err) => jasminify(err, done));
    });

    it('should respond to bad requests', (done) => {
        request(expressApp).post('/api/v1/alerts')
        .send(
            'unexpected body'
        )
        .set('Accept', 'application/xml')
        .expect(HttpStatus('Bad Request'))
        .end((err) => jasminify(err, done));
          
    });

});