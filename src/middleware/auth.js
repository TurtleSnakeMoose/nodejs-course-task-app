const jwt = require('jsonwebtoken');

const _log = require('../common/log')
const User = require('../db/models/userModel');

const checkAuthorization = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token});

        if (!user) {
            throw new Error();
        }

        _log.success(' SUCCESS - AUTHENTICATION ',` user:${user.email}`);
        req.user = user
        req.token = token
        next()
    } catch (error) {
        _log.error(' ERROR - AUTHENTICATION ', 'An unauthorized attempt was made.');
        res.status(401).send('Authentication faild!');
    }
}

module.exports = checkAuthorization