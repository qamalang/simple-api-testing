const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require("chai-http")
const fs = require("fs")
const faker = require("faker")

chai.use(chaiHttp);

const api = chai.request('http://localhost:3000/')

chai.use(require('chai-json-schema'));

describe('Registration Test', function() {
    let username = faker.internet.userName();
    let name = faker.name.findName();

    describe('Success Registration', function() {
        
        let response = {}

        const jsonSchema = require('./schema/01_register_schema.json')

        before(done => {
            api.post('register')
                .set('Content-Type', 'application/json')
                .send({
                    name: name,
                    username: username,
                    password: "password"
                })
                .end(function (err, res) {
                    response = res;
                    done();
                });
        });
        
        it('Response Code Must Be 200 OK', function (done) {
            expect(response.status).to.equals(200);
            done()
        })

        it('Response data match with request data', function (done) {
            expect(response.body.data.name).to.equals(name);
            expect(response.body.data.username).to.equals(username);
            done()
        })

        it('Valid JSON Schema', function (done) {
            expect(response.body).to.be.jsonSchema(jsonSchema);
            done();
        })

        after(done =>{
            global.token = response.body.data.token
            global.name = name
            done();
        })
    })

    describe('Failed Registration Using Existing username', function() {
        before(done => {
            api.post('register')
                .set('Content-Type', 'application/json')
                .send({
                    name: name,
                    username: username,
                    password: "password"
                })
                .end(function (err, res) {
                    response = res;
                    done();
                });
        });
        
        it('Response Code Must Be 422 Unprocessable Entity', function (done) {
            expect(response.status).to.equals(422);
            done()
        })
    })
})

