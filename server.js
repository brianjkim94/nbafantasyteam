const express = require('express'); // Import the express module to create the server
const axios = require('axios'); // Import axios for making HTTP requests
const flash = require('connect-flash'); // Import connect-flash for flash messages
const session = require('express-session'); // Import express-session for session management
const methodOverride = require('method-override'); // Import method-override to use HTTP verbs like PUT and DELETE
const passport = require('./config/passport-config'); // Import passport for authentication
const isLoggedIn = require('./middleware/isLoggedIn'); // Import middleware to check if the user is logged in
require('dotenv').config(); // Load environment variables from .env file

const SECRET_SESSION = process.env.SECRET_SESSION; // Get secret session key from environment variables
const PORT = process.env.PORT || 3000; // Set the port number from environment variables or default to 3000

const app = express(); // Create an Express application

app.set('view engine', 'ejs'); // Set the view engine to EJS for rendering templates
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.static(__dirname + '/public')); // Serve static files from the "public" directory
app.use(methodOverride('_method')); // Use method-override to support PUT and DELETE methods
app.use(session({
    secret: SECRET_SESSION, // Secret for signing session ID cookie
    resave: false, // Do not save session if unmodified
    saveUninitialized: true // Save uninitialized sessions
}));
app.use(flash()); // Use connect-flash for flash messages

// initial passport
app.use(passport.initialize()); // Initialize passport for authentication
app.use(passport.session()); // Use passport to manage sessions

// middleware for tracking users and alerts
app.use((req, res, next) => {
    res.locals.alerts = req.flash(); // Set flash messages to res.locals for easy access in views
    res.locals.currentUser = req.user; // Set current user to res.locals for easy access in views
    next(); // Move to the next middleware
});

app.get('/', (req, res) => {
    res.render('home', {}); // Render the home page
});

// import auth routes
app.use('/auth', require('./controllers/auth')); // Use authentication routes from controllers/auth.js
app.use('/profile', require('./controllers/user')); // Use user profile routes from controllers/user.js
app.use('/players', require('./controllers/player')); // Use player routes from controllers/player.js
app.use('/teams', require('./controllers/team')); // Use team routes from controllers/team.js

const server = app.listen(PORT, () => {
    console.log('🏎️ You are listening on PORT', PORT);
});

module.exports = server; // Export the server for testing or further configuration

