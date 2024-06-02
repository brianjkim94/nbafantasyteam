require('dotenv').config();
const express = require('express');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const { User } = require('./models');
const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3000;

//import model
// const { User } = require('./models');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next(); // going to said route
});

app.get('/', (req, res) => {
    res.render('home', {});
});

// import auth routes
app.use('/auth', require('./controllers/auth'));


// --- AUTHENTICATED ROUTE: go to user profile page
app.get('/profile', isLoggedIn, (req, res) => {
    const { name, email, phone } = req.user;
    res.render('profile', { 
        name,
        email, 
        phone
    });
});

const server = app.listen(PORT, () => {
    console.log('🏎️ You are listening on PORT', PORT);
});

module.exports = server;