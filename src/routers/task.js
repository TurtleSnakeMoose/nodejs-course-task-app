const express = require('express');

const checkAuthorization = require('../middleware/auth');
const Task = require('../db/models/taskModel');
const _log = require('../common/log');

const router = new express.Router();

router.post('/tasks', checkAuthorization, async (req, res) => {
    _log.info(' SUCCESSFUL API CALL TO /tasks ', '');

    try {
        const task = new Task({ ...req.body, owner: req.user._id });
        _log.plain(task)
        await task.save();
        _log.success(' SUCCESS - saved new task',`created _id: ${task._id}`);
        res.status(201).send(task);

    } catch (error) {
        _log.error(' ERROR creating task ',error)
        res.status(400).send(error);
    }
});

router.patch('/tasks/:id', checkAuthorization,  async (req, res) => {
    _log.info(' SUCCESSFUL API PATCH CALL TO /tasks ', '');

    const fieldsToUpdate = Object.keys(req.body);
    const acceptableFields = ['description','completed'];
    const isValidFields = fieldsToUpdate.every(field => acceptableFields.includes(field));

    if (!isValidFields) {
        return res.status(400).send('invalid fields for updating.');
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }

        fieldsToUpdate.forEach((field) => task[field] = req.body[field]);
        await task.save();
        
        res.send(task);

    } catch (error) {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', checkAuthorization, async (req, res) => {
    _log.info(' SUCCESSFUL API DELETE CALL TO /tasks ', '');

    try {
        _log.plain(req.params.id)
        _log.plain(req.user._id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send(`No user found with the id of ${id}`);
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * GET /tasks?completed=true
 * GET /tasks?limit=10&skip=20
 * GET /tasks?sortBy=createdAt:desc <===== mongoDB docs are sorted by these rules: 1 = ascending | 2 = descending;
 */
router.get('/tasks', checkAuthorization,  async (req, res) => {
    _log.info(' SUCCESSFUL API GET CALL TO /tasks ', '');

    try {

        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.sortBy) {
            const queryParts = req.query.sortBy.split(':')
            sort[queryParts[0]] = queryParts[1] === 'asc' ? 1 : -1;
        }

        // OPTION 1
        // const tasks = await Task.find({ owner: req.user._id});
        // if (tasks && tasks.length > 0) {
        //     return res.send(tasks);
        // }
        // res.status(404).send([]);
        
        // OPTION 2 - virtual field
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.offset),
                sort
            }
        }).execPopulate();
        
        return res.send(req.user.tasks);

    } catch (error) {
        res.status(404).send(error)        
    }
});

router.get('/tasks/:id', checkAuthorization,  async (req, res) => {
    _log.info(' SUCCESSFUL API GET CALL TO /tasks ', '');
    const id = req.params.id;

    try {
        const task = await Task.findOne({_id: id, owner: req.user._id});
        if (task) {
            return res.send(task);
        }
        res.status(404).send(null);
    } catch (error) {
        _log.error(' ERROR creating user ',error)
        res.status(404).send(error)
    }
});

module.exports = router;