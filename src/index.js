const express = require('express');
require('./db/mongoose');

const _log = require('./common/log');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT;

// automatically parse json to object for all requests
app.use(express.json())

// inject custom routers to express.
app.use(taskRouter);
app.use(userRouter);

app.listen(port, () => {
    _log.success(' SUCCESS ', `Server is up and running on port ${port}`);
});