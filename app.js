const express = require('express');
const path = require('path');
const { projects } = require('./data/data.json');


const app = express();

// View engine setup
app.set('view engine', 'pug');

// Add static middleware
app.use( '/static', express.static('public'));


// GET home page
app.get('/', function(req, res, next) {
    res.render('index', { projects });
});

// GET projects page
app.get('/projects/:id', function(req, res, next) {
    const projectId = req.params.id;
    const project = projects.find( ({ id }) => id === +projectId)
    if (project) {
        res.render('project', { project });
    } else {
        res.sendStatus(404);
    }
})

// Get about page
app.get('/about', function(req, res, next) {
    res.render('about');
});



app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});