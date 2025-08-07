const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Plans data
const plans = [
  { name: 'Free', timeLimit: 5, cost: 0 },
  { name: 'Bronze', timeLimit: 7, cost: 10 },
  { name: 'Silver', timeLimit: 10, cost: 50 },
  { name: 'Gold', timeLimit: -1, cost: 100 } // -1 means unlimited
];

// Get all plans
router.get('/plans', (req, res) => {
  res.json(plans);
});

// Upgrade Plan
router.post('/upgrade', async (req, res) => {
  const { email, newPlan } = req.body;
  const selectedPlan = plans.find(p => p.name === newPlan);

  if (!selectedPlan) {
    return res.status(400).json({ message: 'Invalid plan' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.subscriptionPlan = selectedPlan.name;
    user.videoTimeLimit = selectedPlan.timeLimit;
    await user.save();

    // Send email invoice
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,         // your Gmail
        pass: process.env.EMAIL_PASSWORD // app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Invoice for ${selectedPlan.name} Plan`,
      text: `Thank you for purchasing the ${selectedPlan.name} plan.\n\nPlan: ${selectedPlan.name}\nTime Limit: ${selectedPlan.timeLimit === -1 ? "Unlimited" : selectedPlan.timeLimit + " minutes"}\nAmount Paid: ₹${selectedPlan.cost}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Plan upgraded and invoice sent', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
