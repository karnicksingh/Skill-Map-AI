
const mongoose = require('mongoose');
const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },timestamp: true
});

module.exports = mongoose.model('blacklistToken', blacklistSchema);