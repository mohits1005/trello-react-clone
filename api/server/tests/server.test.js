const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { BoardModule } = require('./../models/board');
const boards = [{
    id: 1,
    name: 'Test Board',
    lanes: [
        {
            id: 'lane1',
            title: 'Planned Tasks',
            label: '2/2',
            cards: [
                { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', comments: [] },
                { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1', comments: [] } }
            ]
        }
    ]
}, {
    id: 2,
    name: 'Test Board 2',
        lanes: [
            {
                id: 'lane1',
                title: 'Completed',
                label: '0/0',
                cards: []
            }
        ]
}];

expect.extend({
    toBeType(received, argument) {
        const initialType = typeof received;
        const type = initialType === "object" ? Array.isArray(received) ? "array" : initialType : initialType;
        return type === argument ? {
            message: () => `expected ${received} to be type ${argument}`,
            pass: true
        } : {
                message: () => `expected ${received} to be type ${argument}`,
                pass: false
            };
    }
});

beforeEach((done) => {
    BoardModule.remove({}).then(() => {
        return BoardModule.insertMany(boards);
    }).then(() => done());
});
//testing save api call
describe('POST /boards', () => {
    it('should create a new board', (done) => {
        var id = 500;
        var name = 'Testing Board';
        var lanes = [{
            id: 'lane1',
            title: 'Started',
            label: '0/0',
            cards: []
        }];
        request(app)
            .post('/todos')
            .send({ id, name, lanes })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                BoardModule.find({ id }).then((boards) => {
                    expect(boards.length).toBe(1);
                    expect(boards[0].name).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });
});
//testing get api call
describe('GET /boards', () => {
    it('should get all boards', (done) => {
        request(app)
            .get('/boards')
            .expect(200)
            .expect((res) => {
                expect(res.body.boards.length).toBe(2);
            })
            .end(done);
    });
});
//testing update api call
describe('PATCH /boards/:id', () => {
    it('should update the board', (done) => {
        var Id = boards[0].id;
        var name = 'Testing from mocha';
        request(app)
            .patch(`/boards/${Id}`)
            .send({ name })
            .expect(200)
            .expect((res) => {
                expect(res.body.board.name).toBe(text);
            })
            .end(done);
    });
});
//testing delete api call
describe('POST /boards/del/:id', () => {
    it('it should remove a board', (done) => {
        var Id = boards[0].id;
        request(app)
            .post(`/boards/del/${Id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.board.id).toBe(Id);
            })
            .end((err, res) => {
                if (err) {
                    return done();
                }
                BoardModule.findById(Id).then((board) => {
                    expect(board).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    })
});
