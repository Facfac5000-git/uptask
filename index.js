const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

require('dotenv').config({path: 'variables.env'});

//Import helpers
const helpers = require('./helpers');

//Create db connection
const db = require('./config/db');

//Import models
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

db.sync()
    .then(() => console.log('Conectado a la base de datos.'))
    .catch(error => console.log(error));

//Create an express app
const app = express();

// Define static folder
app.use(express.static('public'));

//Enable pug
app.set('view engine', 'pug');

//Enable body parser to read body data
app.use(bodyParser.urlencoded({extended: true}))

//Enable ExpressValidator
app.use(expressValidator());

//Add views folder
app.set('views', path.join(__dirname, './views'));

//Add flash messages
app.use(flash());

//Add cookie parser
app.use(cookieParser());

//Sessions allow users to navigate pages without re-authenticate
app.use(session({
    secret: 'SUPERSECRETKEY',
    resave: false,
    saveUninitialized: false
}));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Transfer vardump to the application
app.use((request, response, next) => {
    response.locals.vardump = helpers.vardump;
    response.locals.flash_messages = request.flash();
    response.locals.user = {...request.user} || null;
    next();
});

//Add router
app.use('/', routes());

//Host and port
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '3000';

app.listen(port, host, () => {
    console.log('El servidor está funcionando correctamente.');
});

require('./handlers/email');