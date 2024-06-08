const express = require('express');
const router = express.Router();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');

// All players GET route
router.get('/all-players', isLoggedIn, async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let perPage = 100;
        const response = await axios.get('https://api.balldontlie.io/v1/players', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            },
            params: { page, per_page: perPage }
        });

        let players = response.data.data;
        let totalPages = response.data.meta.total_pages;

        res.render('allPlayers', {
            players,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        req.flash('error', 'Error fetching players');
        res.redirect('/');
    }
});

// Player stats GET route
router.get('/player/:id', isLoggedIn, async (req, res) => {
    try {
        const playerId = req.params.id;
        const playerResponse = await axios.get(`https://api.balldontlie.io/v1/players/${playerId}`, {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            }
        });

        res.render('playerStats', {
            player: playerResponse.data
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching player stats');
        res.redirect('/all-players');
    }
});

// Player search route (POST)
router.post('/player-search', isLoggedIn, async (req, res) => {
    try {
        const playerName = req.body.name;
        const response = await axios.get('https://api.balldontlie.io/v1/players', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            },
            params: { search: playerName }
        });

        if (response.data.data.length === 0) {
            throw new Error(`Player not found: ${playerName}`);
        }

        const player = response.data.data[0];
        res.redirect(`/player/${player.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching player stats: ' + error.message);
        res.redirect('/');
    }
});

// GET route for player-search by name
router.get('/player-search/:name', isLoggedIn, async (req, res) => {
    try {
        const playerName = req.params.name;
        const response = await axios.get('https://api.balldontlie.io/v1/players', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            },
            params: { search: playerName }
        });

        if (response.data.data.length === 0) {
            throw new Error(`Player not found: ${playerName}`);
        }

        const player = response.data.data[0];
        res.redirect(`/player/${player.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching player stats: ' + error.message);
        res.redirect('/');
    }
});

// Route to render the search player page
router.get('/player-search', isLoggedIn, (req, res) => {
    res.render('searchPlayer');
});

module.exports = router;
