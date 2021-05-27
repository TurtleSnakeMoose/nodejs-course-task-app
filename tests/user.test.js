const testRequest = require('supertest');
const mongoose = require('mongoose');

const { userZeroId, userZero, prepareTestingDb, getJwtForUser } = require('../tests/fixtures/db')
const app = require('../src/app')
const User = require('../src/db/models/userModel');

beforeEach(prepareTestingDb)

afterAll( async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.disconnect()
})

test('Should create a new user', async () => {
    await testRequest(app).post('/users').send({
        name: "Testing mike",
        email: "testingMike@fictional.com",
        password: "test!@#123"
    }).expect(201); 
});

test('Should login with valid credentials', async () => {
    const response = await testRequest(app).post('/users/login').send({
        email: userZero.email,
        password: userZero.password
    }).expect(200)

    const user = await User.findById(userZero._id);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should NOT login with invalid credentials', async () => {
    await testRequest(app).post('/users/login').send({
        email: userZero.email,
        password: userZero.password + '_ruinPass'
    }).expect(404)
})

test('Should get profile for authorized user', async () => {
    await testRequest(app)
        .get('/users/me')
        .set('Authorization', getJwtForUser(userZero))
        .send()
        .expect(200)
})

test('Should NOT get profile for unauthorized user', async () => {
    await testRequest(app)
        .get('/users/me')
        .set('Authorization', getJwtForUser(userZero) + 'ruinedToken')
        .send()
        .expect(401)
})

test('Should attach an avatar to a user', async () => {
    await testRequest(app)
        .post('/users/me/avatar')
        .set('Authorization', getJwtForUser(userZero))
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userZeroId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should remove the user if authorized', async () => {
    await testRequest(app)
        .delete('/users/me')
        .set('Authorization', getJwtForUser(userZero))
        .send()
        .expect(200);

    const user = await User.findById(userZeroId)
    expect(user).toBeNull()
})

test('Should NOT remove the user if unauthorized', async () => {
    await testRequest(app)
        .delete('/users/me')
        .set('Authorization', getJwtForUser(userZero) + 'ruinedToken')
        .send()
        .expect(401)

    const user = await User.findById(userZeroId)
    expect(user).not.toBeNull()
})

test('Should update user field(s)', async () => {
    await testRequest(app)
        .patch('/users/me')
        .set('Authorization', getJwtForUser(userZero))
        .send({name: 'Mike Edited'})
        .expect(200);
    
        const user = await User.findById(userZeroId)
        expect(user.name).toBe('Mike Edited')
})

test('Should NOT update invalid user field(s)', async () => {
    await testRequest(app)
        .patch('/users/me')
        .set('Authorization', getJwtForUser(userZero))
        .send({someMadeUpField: 'Mike Edited'})
        .expect(400);
    
        const user = await User.findById(userZeroId)
        expect(user.name).toBe(user.name)
})