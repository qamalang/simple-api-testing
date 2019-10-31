const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require("chai-http")
const fs = require("fs")
const faker = require("faker")

chai.use(chaiHttp);

const api = chai.request('http://localhost:3000/')

chai.use(require('chai-json-schema'));

describe('Update Profile Test', function() {

    describe('Succes Update Profile', function() {
        
        let response = {}

        const jsonSchema = require('./schema/03_update_profile_schema.json')

        before(done => {
            api.put('profile')
                .set('token', global.token)
                .set('Content-Type', 'form-data')
                .field({
                    name: 'New ' + global.name
                })
                .attach('profile_picture', fs.readFileSync('./assets/images/profile.png'), 'profile.png')
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
            expect(response.body.data.name).to.equals('New ' + global.name);
            done()
        })

        it('Valid JSON Schema', function (done) {
            expect(response.body).to.be.jsonSchema(jsonSchema);
            done();
        })
    })
})

