
'use strict'

process.env.TEST = true;

const test = require('ava');

const findRoot = require('find-root');
const root = findRoot(__dirname);
const path = require('path');

const supertest = require('supertest');

test.beforeEach(async t => {
    const loadApp = require(path.join(root, 'src', './app'));
    let {app, modules} = loadApp({test: true, noLog: true, testfile: __filename});
    const request = require('supertest').agent(app);

    const db = await modules.syncDB();

    t.context.app = app;
    t.context.db = db;
    t.context.request = request;

    t.context.group = await db.Group.create({
        name: "root"
    });


    t.context.user = await db.User.create({
        username: 'login_test',
        password: 'password_test',
        email: 'test@test.com'
    })

    let res = await request.post('/auth/login').send({
        username: 'login_test',
        password: 'password_test'
    })

    t.is(res.status, 200)
})

test.todo('Add user (not authorized)');
test.todo('List all users (personnal info)');
test.todo('Get single user (personnal info)');
test.todo('Update user (not authorized)');
test.todo('Delete user (not authorized)');
test.todo('Add user to group (not authorized)');
test.todo('Remove user from group (not authorized)');