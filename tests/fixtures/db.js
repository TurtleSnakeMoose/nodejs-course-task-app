const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const _log = require('../../src/common/log')
const User = require('../../src/db/models/userModel');
const Task = require('../../src/db/models/taskModel');

const userZeroId = new mongoose.Types.ObjectId()
const userZero = {
    _id: userZeroId,
    name: "User Zero",
    email: "userzero@example.test",
    password: "test!@#123",
    tokens: [{
        _id: new mongoose.Types.ObjectId(),
        token: jsonwebtoken.sign({ _id: userZeroId }, process.env.JWT_SECRET)
    }]
}

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "User One",
    email: "userone@example.test",
    password: "test!@#123",
    tokens: [{
        _id: new mongoose.Types.ObjectId(),
        token: jsonwebtoken.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const taskZero = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is taskZero, belonging to userZero and its incomplete',
    completed: false,
    owner: userZero._id
}

const taskZero_another = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is another taskZero belonging to userZero and its complete',
    completed: true,
    owner: userZero._id
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is taskOne, belonging to userOne and its complete',
    completed: true,
    owner: userOne._id
}

const prepareTestingDb = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    _log.success(' SUCCESS ', `relevant tables in testing db at ${process.env.MONGODB_URL} were whiped clean.`)
    
    await new User(userZero).save()
    await new User(userOne).save()
    await new Task(taskZero).save()
    await new Task(taskZero_another).save()
    await new Task(taskOne).save()
    _log.success(' SUCCESS ', `testing db was setup.`)
}

/**
 * get the jwt from the desired user object
 * @param {Object} user the user object to extract the token from 
 * @returns {String} the user's first jwt
 */
const getJwtForUser = (user) => {
    return `Bearer ${user.tokens[0].token}`
}

module.exports = {
    getJwtForUser,
    userZeroId,
    userZero,
    userOneId,
    userOne,
    taskZero,
    taskZero_another,
    taskOne,
    prepareTestingDb
}