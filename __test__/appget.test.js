const request = require('supertest');
const app = require('../src/server/server');

describe('test get endpoint', () => {
    it('returns "{}"', async () => {
        const response = await request(app)
        .get('/getData')

        expect(response.text).toEqual("{}")
    })
})