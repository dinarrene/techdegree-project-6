const express = require('express');
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

// Get about page
app.get('/about', function(req, res, next) {
    res.render('about');
});


//Get generated error route - create and throw 500 server error
app.use('/error', (req, res, next) => {
    console.log('Custom error route called');
    const err = new Error();
    err.status = 500;
    throw err;
});

// Get/throw project page error
app.get('/projects/:id', function(req, res, next) {
    const projectId = req.params.id;
    const project = projects.find( ({ id }) => id === +projectId)
    if (project) {
        res.render('project', { project });
    } else {
        const err = new Error();
        err.status = 404;
        err.message = `Looks like the page you requested doesn't exist.`
        throw err;
    }
});

// Custom 404 error
app.use((req, res, next) => {
    console.log("Page load error is called");
    const err = new Error();
    err.status = 404;
    err.message = `Looks like the page you requested doesn't exist.`
    next(err);
});

// 404 Error handler
app.use((req, res, next) => {
    console.log('404 handler called');
    res.status(404).render('page-not-found');
});

// Global error handler
app.use((err, req, res, next) => {
    if (err) {
        console.log('Global handler called', err)
    }

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