const mongoose = require('mongoose');

const nbaTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    conference: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true
    }
}, { timestamps: true });

const NBATeam = mongoose.model('NBATeam', nbaTeamSchema);

module.exports = NBATeam;
