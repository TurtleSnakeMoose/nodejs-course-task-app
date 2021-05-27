const app = require('./app')
const _log = require('./common/log')

const port = process.env.PORT
app.listen(port, () => {
    _log.success(' SUCCESS ', `Server is up and running on port ${port}`)
});