const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Plan Schema
const planSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
});

const Plan = mongoose.model('Plan', planSchema);

// Subscribe to a plan
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, planName, price, duration } = req.body;

    if (!userId || !planName || !price || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const newPlan = new Plan({
      userId,
      planName,
      price,
      duration,
      endDate
    });

    await newPlan.save();
    res.status(201).json({ message: 'Plan subscribed successfully', plan: newPlan });
  } catch (error) {
    console.error('❌ Error subscribing to plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all plans for a user
router.get('/:userId', async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.params.userId });
    res.json(plans);
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
