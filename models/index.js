const mongoose = require('mongoose');
require('dotenv').config();

// import models
const User = require('./user');
const Team = require('./team');

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
db.on('error', (error) => console.log('Database error \n', error));

module.exports = {
    User,
    Team
};