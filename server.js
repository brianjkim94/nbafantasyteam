const express = require('express'); // Import the express module to create the server
const axios = require('axios'); // Import axios for making HTTP requests
const flash = require('connect-flash'); // Import connect-flash for flash messages
const session = require('express-session'); // Import express-session for session management
const methodOverride = require('method-override'); // Import method-override to use HTTP verbs like PUT and DELETE
const passport = require('./config/passport-config'); // Import passport for authentication
const isLoggedIn = require('./middleware/isLoggedIn'); // Import middleware to check if the user is logged in
const { User, Team } = require('./models'); // Import User and Team models
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

// --- AUTHENTICATED ROUTE: go to user profile page
app.get('/profile', isLoggedIn, (req, res) => { // Profile route, accessible only if logged in
    const { name, email, phone } = req.user; // Get user details from the request object
    res.render('profile', { 
        name,
        email, 
        phone
    });
});

// All players route
app.get('/all-players', isLoggedIn, async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Get the current page from query parameters or default to 1
        let perPage = 100; // Number of players per page
        const response = await axios.get('https://api.balldontlie.io/v1/players', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            },
            params: {
                page: page,
                per_page: perPage
            }
        });

        let players = response.data.data; // Get players data from response
        let totalPages = response.data.meta.total_pages; // Get total number of pages

        res.render('allPlayers', {
            players: players,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        req.flash('error', 'Error fetching players'); // Flash error message
        res.redirect('/'); // Redirect to home page
    }
});


// Player stats route
app.get('/player/:id', isLoggedIn, async (req, res) => {
    try {
        const playerId = req.params.id; // Get player ID from URL parameters
        const playerResponse = await axios.get(`https://api.balldontlie.io/v1/players/${playerId}`, {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            }
        });

        res.render('playerStats', {
            player: playerResponse.data // Render player stats page with player data
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching player stats'); // Flash error message
        res.redirect('/all-players'); // Redirect to all players page
    }
});


// Save team route
app.post('/save-team', isLoggedIn, async (req, res) => {
    try {
        const { teamName, player1, player2, player3, player4, player5 } = req.body; // Get team details from request body
        const players = [player1, player2, player3, player4, player5]; // Create an array of players

        const team = {
            name: teamName,
            players: players
        };

        await Team.create(team); // Save the team to the database

        req.flash('success', 'Team saved successfully!'); // Flash success message
        res.redirect('/view-teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error saving the team: ' + error.message); // Flash error message
        res.redirect('/'); // Redirect to home page
    }
});

// View teams route
app.get('/view-teams', isLoggedIn, async (req, res) => {
    try {
        const teams = await Team.find({}); // Get all teams from the database
        res.render('viewTeams', { teams }); // Render the view teams page with the teams data
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching teams'); // Flash error message
        res.redirect('/'); // Redirect to home page
    }
});

// Player search route
app.get('/player-search', isLoggedIn, async (req, res) => {
    try {
        const playerName = req.query.name; // Get player name from query parameters
        const response = await axios.get('https://api.balldontlie.io/v1/players', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            },
            params: {
                search: playerName
            }
        });

        if (response.data.data.length === 0) {
            throw new Error(`Player not found: ${playerName}`); // Throw error if player not found
        }

        // Assume the first result is the correct player
        const player = response.data.data[0];
        res.redirect(`/player/${player.id}`); // Redirect to player stats page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching player stats: ' + error.message); // Flash error message
        res.redirect('/view-teams'); // Redirect to view teams page
    }
});


const server = app.listen(PORT, () => {
    console.log('🏎️ You are listening on PORT', PORT);
});

module.exports = server;