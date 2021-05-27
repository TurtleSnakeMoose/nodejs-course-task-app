const express = require('express');
require('./db/mongoose');

const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

const app = express();

// automatically parse json to object for all requests
app.use(express.json())

// inject custom routers to express.
app.use(taskRouter);
app.use(userRouter);

module.exports = app;