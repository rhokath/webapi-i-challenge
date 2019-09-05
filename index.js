// implement your API here
require('dotenv').config();
const express = require('express');
const Users = require('./data/db');
const server = express();

server.use(express.json());

// post request
server.post('/api/users', (req, res)=> {
    const { name, bio} = req.body;
    if( !name || !bio){
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'});

    } else {
        Users.insert(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(()=> {
                res.status(500).json({
                    errorMessage:
                    'There was an error while saving the user to the database',
                });
            });
    }
})
// get requests
server.get('/api/users', (req, res)=> {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(()=> {
            res.status(500).json({
                errorMessage: 'The users information could not be retrieved.',
            });
        });
});
server.get('/api/users/:id', (req, res)=>{
    Users.findById(req.params.id)
        .then(user => {
            if (user){
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist.'
                });
            }
        })
        .catch(()=>{
            res.status(500).json({
                errorMessage: 'The user information could not be retrieved.'
            });
        });

})
//delete
server.delete('/api/users/:id', (req, res)=>{
    Users.remove(req.params.id)
    .then(count => {
        if (count && count > 0){
            res.status(200).json({
                message: 'the user was deleted.',
            });
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.'
            });
        }
    })
    .catch(()=> {
        res.status(500).json({
            errorMessage: 'The user could not be removed'
        });
    });
});
//put request
server.put('/api/users/:id', (req, res)=> {
    const { name, bio} = req.body;
    if(!name || ! bio){
        res.status(400).json({
            errorMessage: 'please provide name and bio for the user.'
        });
    } else {
        Users.update(req.params.id, req.body)
        .then(user => {
            if (user){
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: 'the user with the specified ID does not exist.'
                });
            }
        })
        .catch(()=> {
            res.status(500).json({
                errorMessage: 'The user information could not be modified.'
            })
        })
    }

})

const port = process.env.PORT || 8000;
server.listen(port, ()=> console.log(`\n*** API on port ${port} ***\n`));

