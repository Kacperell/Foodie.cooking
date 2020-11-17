const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const {
    promisify
} = require("es6-promisify"); //chyba usunac
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

// const Bundler = require('parcel-bundler');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// serves up static files from the public folder. Anything in public/will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// let bundler = new Bundler('app.js');
// app.use(bundler.middleware());


// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

app.enable('trust proxy'); //?
app.use(session({
    secret: 'foodPorn',
    key: 'delicious',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: true 
    // }
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));


// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
});

app.use('/', routes);

app.use(errorHandlers.notFound);

app.use(errorHandlers.flashValidationErrors);


if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}
// production error handler
app.use(errorHandlers.productionErrors);
app.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = app;