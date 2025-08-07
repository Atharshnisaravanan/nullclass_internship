const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscriptionPlan: { type: String, default: 'Free' },
  videoTimeLimit: { type: Number, default: 5 } // Free plan default
});

module.exports = mongoose.model('User', userSchema);
