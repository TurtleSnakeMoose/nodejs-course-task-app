// KEPT THIS FILE FOR REFERENCE ONLY - OBSOLETE SINCE MONGOOSE

// const {MongoClient, ObjectID} = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const dbName = 'task-manager';

// MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology:true} ,(err, client) => {
//     if (err) {
//         return console.log('Connection to mongoDB failed!');
//     }

//     const db = client.db(dbName);

//     //// insert one document into collection
//     // db.collection('users').insertOne(
//     //     [
//     //         {
//     //             name: 'Mini',
//     //             age: 32
//     //         },
//     //         {
//     //             name: 'Igor',
//     //             age: 34
//     //         }
//     //     ], (err, result) => {
        
//     //         if (err) {
//     //             return console.log('Unable to insert document!');
//     //         }

//     //         console.log(result);
//     // });

//     //// insert multiple documents into collection
//     // db.collection('tasks').insertMany(
//     //     [
//     //         {
//     //             description: 'Wash car',
//     //             completed: false
//     //         },
//     //         {
//     //             description: 'Learn Node.js',
//     //             completed: false
//     //         },
//     //         {
//     //             description: 'Order something to eat',
//     //             completed: true
//     //         },
//     //         {
//     //             description: 'Eat',
//     //             completed: false
//     //         },
//     //         {
//     //             description: 'Clean up after meal',
//     //             completed: true
//     //         }
//     //     ], (err, result) => {
        
//     //         if (err) {
//     //             return console.log('Unable to insert document!');
//     //         }

//     //         console.log(result.ops);
//     // });

//     //// get single document by _id
//     // db.collection('tasks').findOne({ _id: new ObjectID('60a29212d2a5d6017c9a8abc')}, (err, task) => {
//     //     if (err) {
//     //         return console.log('Could\'nt get task by id');
//     //     }

//     //     console.log(task);
//     // });

//     //// get multiple documents by fields as "pointers"
//     // const uncompletedTasks = db.collection('tasks').find({ completed: false});
//     // uncompletedTasks.toArray((error, tasks) => {
//     //     if (err) {
//     //         return console.log('Could\'nt get uncompleted tasks');
//     //     }

//     //     console.log(tasks);
//     // });

//     //// update multiple documents in a collection
//     // db.collection('tasks').updateMany({
//     //     completed: false
//     // }, {
//     //     $set: {completed: true}
//     // }).then((result) => {
//     //     console.log(result.modifiedCount)
//     // }).catch((error) => {
//     //     console.log(error)
//     // });

//     // // delete a single document in a collection
//     // db.collection('tasks').deleteOne({
//     //     description: 'Clean up after meal'
//     // }).then((result) => {
//     //     console.log(result.deletedCount)
//     // }).catch((error) => {
//     //     console.log(error)
//     // });
    
// });
