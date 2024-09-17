import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import { History } from '../../src/models/historyModel';
import app from '../../src/app';

const chai = use(chaiHttp);

describe('History Controller', function () {
    before(async function () {
        const mongod = await MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('POST /history', function () {
        afterEach(async function () {
            await History.deleteMany();
        });

        it('Should create history with valid data', done => {
            chai.request(app)
                .post('/history')
                .send({ userId: new Types.ObjectId(), questionId: new Types.ObjectId() })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('data');
                    done();
                });
        });

        it('Should return 400 if user ID is missing', done => {
            chai.request(app)
                .post('/history')
                .send({ questionId: new Types.ObjectId() })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Should return 400 if question ID is missing', done => {
            chai.request(app)
                .post('/history')
                .send({ userId: new Types.ObjectId() })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Should return 400 if user ID is invalid', done => {
            chai.request(app)
                .post('/history')
                .send({ userId: 'invalid' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Should return 400 if question ID is invalid', done => {
            chai.request(app)
                .post('/history')
                .send({ questionId: 'invalid' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });

    describe('GET /history/:userId', function () {
        let validUserId: Types.ObjectId;

        before(async function() {
            validUserId = new Types.ObjectId();
            await History.create({ userId: validUserId, questionId: new Types.ObjectId() });
        })

        it('Should return history by userId', done => {
            chai.request(app)
                .get(`/history/${validUserId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.data).to.be.an('array');
                    done();
                });
        });

        it('Should return 400 if userId is invalid', done => {
            chai.request(app)
                .get(`/history/invalidId`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message');
                    done();
                });
        });
    })
});
