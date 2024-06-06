const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios for making HTTP requests
const isLoggedIn = require('../middleware/isLoggedIn'); // Import middleware to check if the user is logged in

// All NBA teams route
router.get('/nba-teams', isLoggedIn, async (req, res) => {
    try {
        const response = await axios.get('https://api.balldontlie.io/v1/teams', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            }
        });

        const teams = response.data.data; // Get teams data from response

        res.render('allNBATeams', { teams });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching NBA teams');
        res.redirect('/');
    }
});

// Players under a specific NBA team route
router.get('/nba/team/:id', isLoggedIn, async (req, res) => {
    try {
        const teamId = req.params.id; // Get team ID from URL parameters
        const response = await axios.get('https://api.balldontlie.io/v1/players', {
            headers: {
                'Authorization': '6e33dc9e-09e4-4366-8905-8a9cfbad54e5'
            },
            params: {
                team_ids: [teamId],
                per_page: 100
            }
        });

        const players = response.data.data; // Get players data from response

        res.render('nbaTeamPlayers', { players });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching team players');
        res.redirect('/nba-teams');
    }
});

module.exports = router;
