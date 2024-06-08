const express = require('express');
const axios = require('axios');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const { User, Team } = require('./models');
require('dotenv').config();
const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nbaFantasyTeams';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('home', {});
});

app.use('/auth', require('./controllers/auth'));
app.use('/', require('./controllers/user'));
app.use('/', require('./controllers/players'));
app.use('/', require('./controllers/teams'));
app.use('/', require('./controllers/nbaTeams'));

const server = app.listen(PORT, () => {
    console.log('🏎️ You are listening on PORT', PORT);
});

module.exports = server;
