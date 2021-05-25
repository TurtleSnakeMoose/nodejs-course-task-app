const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const dispatchEmail = require('../emails/account');
const checkAuthorization = require('../middleware/auth');
const _log = require('../common/log');
const User = require('../db/models/userModel');

const avatarUploader = multer({
    // dest: 'avatars', ===> specify destination to save on local disk, don't specify to return the file to the caller (route).
    limits: {
        fileSize: 1000000 // 1,000,000 = 1mb
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // regex for file extensions
            return cb(new Error('Uploaded file must be .jpg / .jpeg / .png'))
        }
        cb(undefined, true);
    }
})

const router = new express.Router();

// CREATE
router.post('/users', async (req, res) => {
    _log.info(' SUCCESSFUL API POST CALL TO /users ', '');
    const user = new User(req.body);

    try {
        await user.save();
        dispatchEmail.sendWelcomeEmail(user.email, user.name)
        const token = await user.addAuthToken();
        _log.success(' SUCCESS - saved new user ',`created _id: ${user._id}`);
        res.status(201).send({user,token});    
    } catch (error) {
        _log.error(' ERROR creating user ',error)
        res.status(400).send(error);
    }
});

// LOGIN
router.post('/users/login', async (req, res) => {
    try {
        _log.info(' LOGIN REQUEST ', `user: ${req.body.email} pass: ${req.body.password}`)

        const user = await User.getByCredentials(req.body.email, req.body.password)
        const token = await user.addAuthToken()
        res.send({user, token});
    } catch (error) {
        res.status(404).send(error)
    }
});

// LOGOUT
router.post('/users/logout', checkAuthorization ,async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        _log.success(' SUCCESS LOGOUT ',`the user ${req.user.email} has logged-out!`);
        res.status(200).send('user was successfuly logged out');
    } catch (error) {
        res.status(400).send(error)
    }
});

// LOGOUT ALL
router.post('/users/logoutall', checkAuthorization ,async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        _log.success(' SUCCESS LOGOUT-ALL ',`the user ${req.user.email} has logged-out from all devices!`);
        res.status(200).send('user was successfuly logged out from all devices!');
    } catch (error) {
        res.status(400).send(error)
    }
});

// UPDATE CURRENT USER
router.patch('/users/me', checkAuthorization,  async (req, res) => {
    _log.info(' SUCCESSFUL API PATCH CALL TO /users ', '');

    const fieldsToUpdate = Object.keys(req.body);
    const acceptableFields = ['name','email','password','age'];
    const isValidFields = fieldsToUpdate.every(field => acceptableFields.includes(field));

    if (!isValidFields) {
        return res.status(400).send();
    }

    try {
        fieldsToUpdate.forEach((field) => req.user[field] = req.body[field]);
        await req.user.save();
        
        res.send(req.user);

    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE CURRENT USER
router.delete('/users/me', checkAuthorization, async (req, res) => {
    _log.info(' SUCCESSFUL API DELETE CALL TO /users ', '');
    try {
        req.user.remove()
        dispatchEmail.sendGoodbyEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET CURRENT USER
router.get('/users/me', checkAuthorization, async (req, res) => {
    _log.info(' SUCCESSFUL API GET CALL TO /users ', '');
    res.send(req.user);
});

// UPLOAD USER FILE
router.post('/users/me/avatar', checkAuthorization, avatarUploader.single('avatar') , async (req, res) => {
    _log.info(' SUCCESSFUL API POST CALL TO /users/me/avatar ', '');
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save()
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({error: err.message});
});


// DELETE USER FILE
router.delete('/users/me/avatar', checkAuthorization, async (req, res) => {
    _log.info(' SUCCESSFUL API DELETE CALL TO /users/me/avatar ', '');
    req.user.avatar = undefined;
    await req.user.save()
    res.send({success: 'user avatar was deleted'});
});

// GET USER FILE
router.get('/users/:id/avatar', async (req, res) => {
    _log.info(' SUCCESSFUL API GET CALL TO /users/:id/avatar ', '');
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('User or user avatar isnt available!')
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

// UPDATE - no longer needed
// router.patch('/users/:id', async (req, res) => {
//     _log.info(' SUCCESSFUL API PATCH CALL TO /users ', '');

//     const fieldsToUpdate = Object.keys(req.body);
//     const acceptableFields = ['name','email','password','age'];
//     const isValidFields = fieldsToUpdate.every(field => acceptableFields.includes(field));

//     if (!isValidFields) {
//         return res.status(400).send();
//     }

//     try {
//         const id = req.params.id;
//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(404).send();
//         }

//         fieldsToUpdate.forEach((field) => user[field] = req.body[field]);
//         await user.save();
        
//         res.send(user);

//     } catch (error) {
//         res.status(400).send(error);
//     }
// });




// DELETE CURRENT USER - no longer needed
// router.delete('/users/:id', async (req, res) => {
//     _log.info(' SUCCESSFUL API DELETE CALL TO /users ', '');
//     const id = req.params.id;
//     try {
//         const user = await User.findByIdAndDelete(id);
//         if (!user) {
//             return res.status(404).send(`No user found with the id of ${id}`);
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });



// GET BY ID - no longer needed
// router.get('/users/:id', async (req, res) => {
//     _log.info(' SUCCESSFUL API GET CALL TO /users ', '');
//     const id = req.params.id;

//     try {
//         const user = await User.findById(id);

//         if (user) {
//             return res.send(user);
//         }
//         res.status(404).send(null);        
//     } catch (error) {
//         _log.error(' ERROR creating user ',error);
//         res.status(404).send(error);
//     }
// });

module.exports = router;