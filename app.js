const express = require('express');
const { exists } = require('fs');
const path = require('path');
const { render } = require('pug');
const { projects } = require('./data/data.json');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add static middleware
app.use( '/static', express.static(path.join(__dirname, 'public')));

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


// Error Handlers
app.use('/:id', (req, res, next) => {
    if (projects[req.params.id]) {
        res.render('project');
    } else {
       const err = new Error('Page Not Found');
       err.status = 404;
       err.message = `Looks like the page you requested doesn't exists.` 
       next(err);
    }
})


app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render('page-not-found', { err });
    } else {
        err.message = err.message || `Oops! It looks like something went wrong with the server.`
        res.status(err.status || 500).render('error', { err });
    }
});


// Log of localhost server location
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});