// Importing express Framework
const express = require('express');
// Importing body-parser, for parse incoming text from form fields
const bodyParser = require('body-parser');
//  Importing path to help give the path
//  Because Nodejs counts path from root dir of pc not the project
const path = require('path');
// Running the Express app by adding Paranthasis: pexress()
const app = express();

// Usings pub view engine, and telling it to look for views in views directory
app.set('view engine', 'pug');
app.set('views', 'views');

// Importing routing files: admin.js and shop.js
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Parse incoming text from forms
app.use(bodyParser.urlencoded({ extended: false }));
// making public directory accesible for static fils like css, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// /admin is the path filtering, so every route in adminRouter, starts with /admin/...
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// middleware for wrong address
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

// for running server on localhost:3000
app.listen(3000);