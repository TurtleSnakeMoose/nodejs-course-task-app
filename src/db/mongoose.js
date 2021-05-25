const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGODB_URL}/task-manager-api`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// const newUser = new models.User({
//     name: 'Mik',
//     email: '   misharoskin@gmail.com    ',
//     password: '     @@dsd2233'
// });

// newUser.save().then(() => {
//     debugger;
//     console.log(newUser);
// }).catch((err) => {
//     debugger;
//     console.log('Error:', err);
// });

// const newTask = new models.Task({
//     description: 'cykaBlyat cheeki breeki',
// });

// newTask.save().then(() => {
//     debugger;
//     console.log(newTask);
// }).catch((err) => {
//     debugger;
//     console.log('Error:', err);
// });

module.exports = mongoose;
