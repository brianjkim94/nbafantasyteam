const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios for making HTTP requests
const isLoggedIn = require('../middleware/isLoggedIn'); // Import middleware to check if the user is logged in

// All players route
router.get('/all-players', isLoggedIn, async (req, res) => {
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
router.get('/player/:id', isLoggedIn, async (req, res) => {
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

// Player search route
router.get('/player-search', isLoggedIn, async (req, res) => {
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

module.exports = router;
