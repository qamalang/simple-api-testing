const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require("chai-http");
const chaiJsonSchema = require("chai-json-schema");

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

const api = chai.request('http://localhost:3000/');

describe('Profile Test', function() {

    describe('Success get profile', function() {
        const jsonSchema = require('./schema/02_profile_schema.json');

        before(done => {
            api.get('profile')
                .set('token', global.token)
                .end(function (err, res) {
                    response = res;
                    done();
                });
        });
        
        it('Response Code Must Be 200 OK', function (done) {
            expect(response.status).to.equals(200);
            done();
        });

        it('Response data match with request data', function (done) {
            expect(response.body.data.name).to.equals(global.name);
            done();
        });

        it('Valid JSON Schema', function (done) {
            expect(response.body).to.be.jsonSchema(jsonSchema);
            done();
        });
    });

    describe('Failed get profile using invalid token', function() {

        const jsonSchema = require('./schema/02_profile_schema.json');

        before(done => {
            api.get('profile')
                .set('token', global.token+ "invalid token")
                .end(function (err, res) {
                    response = res;
                    done();
                });
        });
        
        it('Response Code Must Be 401 Unauthorized', function (done) {
            expect(response.status).to.equals(401);
            done();
        })

        it('Valid JSON Schema', function (done) {
            expect(response.body).to.not.be.jsonSchema(jsonSchema);
            done();
        });
    });
});