const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn'); // Import middleware to check if the user is logged in

// --- AUTHENTICATED ROUTE: go to user profile page
router.get('/', isLoggedIn, (req, res) => { // Profile route, accessible only if logged in
    const { name, email, phone } = req.user; // Get user details from the request object
    res.render('profile', { 
        name,
        email, 
        phone
    });
});

module.exports = router;
