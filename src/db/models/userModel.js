const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('../models/taskModel')
const _log = require('../../common/log');

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
    },
    email: { 
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        }
     },
    password: {
        type: String, 
        required: true,
        trim: true,
        validate(pass) {
            const isLengthValid = pass.length > 6,
                isContainsPassword = pass.toLowerCase().indexOf('password') > -1;
            
            if (!isLengthValid) {
                throw new Error('Password should contain atleast 6 chars.');
            }

            if (isContainsPassword) {
                throw new Error('Password should not contain the word "Password".');
            }
        }
    },
    age: {
        type: Number
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
});


userSchema.methods.addAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);

    _log.success(' JWT CREATED ',`${token}`)       
    user.tokens = [...user.tokens, {token}]
    await user.save()

    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.__v
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.getByCredentials = async (email, password) => {

    const user = await User.findOne({email});

    if (!user) {
        _log.error(' USER DOEST NOT EXIST ', `unable to find user by ${email}`);
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        _log.error(' USER-PASSWORD MISMATCH ', `the password provided did not match for ${email}`);
        throw new Error('Unable to login!')
    }

    _log.success(' USER MATCH FOUND ', `successful password match for ${email}`);
    return user;
}


// hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    
    if (user.isModified('password')) {
        _log.info(' Password as plain text: ', user.password)       
        user.password = await bcrypt.hash(user.password, 8);
        _log.info(' Password after hashing ',user.password)       
    }
    
    next();
});

userSchema.pre('remove', async function(next){
    const user = this
    _log.info(' REMOVIONG TASKS RELATED TO USER ', `${user.email}`)
    await Task.deleteMany({ owner: user._id});
    _log.success(' SUCCESS TASKS REMOVED ', ` all tasks related to user ${user.email} were removed!`)
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;