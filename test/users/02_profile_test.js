const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require("chai-http")

chai.use(chaiHttp);

const api = chai.request('http://localhost:3000/')

chai.use(require('chai-json-schema'));

describe('Profile Test', function() {

    describe('Success get profile', function() {

        const jsonSchema = {
            "type": "object",
            "required": [
                "success",
                "message",
                "data"
            ],
            "properties":{
                "success": {
                    "type": "boolean"
                },
                "message": {
                    "type": "string"
                },
                "data": {
                    "type": "object"
                }
            }
        }

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
            done()
        })

        it('Response data match with request data', function (done) {
            expect(response.body.data.name).to.equals(global.name);
            done()
        })

        // it('Valid JSON Schema', function (done) {
        //     expect(response.body).to.be.jsonSchema(jsonSchema);
        //     done();
        // })
    })
})

