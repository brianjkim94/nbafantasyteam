const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    stats: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
