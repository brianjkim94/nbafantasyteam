const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn'); // Import middleware to check if the user is logged in
const { Team } = require('../models'); // Import Team model

// Save team route
router.post('/save', isLoggedIn, async (req, res) => {
    try {
        const { teamName, player1, player2, player3, player4, player5 } = req.body; // Get team details from request body
        const players = [player1, player2, player3, player4, player5]; // Create an array of players

        const team = {
            name: teamName,
            players: players
        };

        await Team.create(team); // Save the team to the database

        req.flash('success', 'Team saved successfully!'); // Flash success message
        res.redirect('/teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error saving the team: ' + error.message); // Flash error message
        res.redirect('/'); // Redirect to home page
    }
});

// View teams route
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const teams = await Team.find({}); // Get all teams from the database
        res.render('viewTeams', { teams }); // Render the view teams page with the teams data
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching teams'); // Flash error message
        res.redirect('/'); // Redirect to home page
    }
});

// Edit player route (PUT)
router.put('/edit-player', isLoggedIn, async (req, res) => {
    try {
        const { teamId, oldPlayerName, newPlayerName } = req.body; // Get team and player details from request body

        const team = await Team.findById(teamId); // Find the team by ID
        if (!team) {
            throw new Error('Team not found'); // Throw error if team not found
        }

        const playerIndex = team.players.findIndex(player => player === oldPlayerName); // Find the player in the team
        if (playerIndex === -1) {
            throw new Error('Player not found in team'); // Throw error if player not found in the team
        }

        team.players[playerIndex] = newPlayerName; // Update player name
        await team.save(); // Save the updated team

        req.flash('success', 'Player updated successfully'); // Flash success message
        res.redirect('/teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating player: ' + error.message); // Flash error message
        res.redirect('/teams'); // Redirect to view teams page
    }
});

// Edit team name route (PUT)
router.put('/edit-name', isLoggedIn, async (req, res) => {
    try {
        const { teamId, newTeamName } = req.body; // Get team details from request body

        const team = await Team.findById(teamId); // Find the team by ID
        if (!team) {
            throw new Error('Team not found'); // Throw error if team not found
        }

        team.name = newTeamName; // Update team name
        await team.save(); // Save the updated team

        req.flash('success', 'Team name updated successfully'); // Flash success message
        res.redirect('/teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating team name: ' + error.message); // Flash error message
        res.redirect('/teams'); // Redirect to view teams page
    }
});

// Add player to team route
router.post('/add-player', isLoggedIn, async (req, res) => {
    try {
        const { teamId, playerName } = req.body; // Get team ID and player name from request body

        const team = await Team.findById(teamId); // Find the team by ID
        if (!team) {
            throw new Error('Team not found'); // Throw error if team not found
        }

        team.players.push(playerName); // Add the player to the team
        await team.save(); // Save the updated team

        req.flash('success', 'Player added successfully'); // Flash success message
        res.redirect('/teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error adding player: ' + error.message); // Flash error message
        res.redirect('/teams'); // Redirect to view teams page
    }
});

// Delete player route
router.delete('/delete-player', isLoggedIn, async (req, res) => {
    try {
        const { teamId, playerName } = req.body; // Get team ID and player name from request body

        const team = await Team.findById(teamId); // Find the team by ID
        if (!team) {
            throw new Error('Team not found'); // Throw error if team not found
        }

        team.players = team.players.filter(player => player !== playerName); // Remove the player from the team
        await team.save(); // Save the updated team

        req.flash('success', 'Player removed successfully'); // Flash success message
        res.redirect('/teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error removing player: ' + error.message); // Flash error message
        res.redirect('/teams'); // Redirect to view teams page
    }
});

// Delete team route
router.delete('/delete-team', isLoggedIn, async (req, res) => {
    try {
        const { teamId } = req.body; // Get team ID from request body

        await Team.findByIdAndDelete(teamId); // Delete the team by ID

        req.flash('success', 'Team deleted successfully'); // Flash success message
        res.redirect('/teams'); // Redirect to view teams page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error deleting team: ' + error.message); // Flash error message
        res.redirect('/teams'); // Redirect to view teams page
    }
});

module.exports = router;

