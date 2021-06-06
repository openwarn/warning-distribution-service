const { init } = require('./app');
const supertest = require('supertest');
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
    let request;

    beforeAll(() => {
        request = supertest(init().app)
    });

    it('should provide health endpoint', (done) => {
        request.get('/health')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(HttpStatus('OK'))
            .end((err) => jasminify(err, done));
    });

    it('should respond to bad requests', (done) => {
        request.post('/api/v1/alerts')
        .send(
            'unexpected body'
        )
        .set('Accept', 'application/xml')
        .expect(HttpStatus('Bad Request'))
        .end((err) => jasminify(err, done));
          
    });

});