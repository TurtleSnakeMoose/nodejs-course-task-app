const testRequest = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app')
const Task = require('../src/db/models/taskModel');
const {
     userZeroId, 
     userZero, 
     taskZero,
     taskZero_another,
     taskOne,
     prepareTestingDb, 
     getJwtForUser, 
     userOne
    } = require('../tests/fixtures/db')


beforeEach(prepareTestingDb)

afterAll( async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.disconnect()
})

test('Should create a new task', async () => {
    const response = await testRequest(app)
        .post('/tasks')
        .set('Authorization', getJwtForUser(userZero))
        .send({
            description: 'This was created by jest!'
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should return 2 tasks for requested user', async () => {
    const response = await testRequest(app)
        .get('/tasks')
        .set('Authorization', getJwtForUser(userZero))
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should NOT delete task belonging to a different user' , async () => {
    await testRequest(app)
        .delete(`/tasks/${taskZero._id}`)
        .set('Authorization', getJwtForUser(userOne))
        .send()
        .expect(400)
    

    const task = await Task.findById(taskZero._id)
    expect(task).not.toBeNull()
})

