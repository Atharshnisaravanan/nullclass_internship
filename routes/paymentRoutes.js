const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Define available plans
const plans = [
  { name: 'Free', timeLimit: 5, cost: 0 },
  { name: 'Bronze', timeLimit: 7, cost: 10 },
  { name: 'Silver', timeLimit: 10, cost: 50 },
  { name: 'Gold', timeLimit: -1, cost: 100 } // -1 for unlimited
];

// GET all available plans
router.get('/plans', (req, res) => {
  return res.json(plans);
});

// POST upgrade plan
router.post('/upgrade', async (req, res) => {
  try {
    const { email, newPlan } = req.body;

    // Validate request body
    if (!email || !newPlan) {
      return res.status(400).json({ message: 'Email and newPlan are required.' });
    }

    const selectedPlan = plans.find(plan => plan.name === newPlan);

    if (!selectedPlan) {
      return res.status(400).json({ message: 'Invalid plan selected.' });
    }

    // Find or create the user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    // Update user plan
    user.subscriptionPlan = selectedPlan.name;
    user.videoTimeLimit = selectedPlan.timeLimit;
    await user.save();

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Invoice for ${selectedPlan.name} Plan`,
      text: `Thank you for purchasing the ${selectedPlan.name} plan.\n\nPlan: ${selectedPlan.name}\nTime Limit: ${selectedPlan.timeLimit === -1 ? 'Unlimited' : selectedPlan.timeLimit + ' minutes'}\nAmount Paid: ₹${selectedPlan.cost}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success
    return res.json({ message: 'Plan upgraded and invoice sent successfully.', user });

  } catch (err) {
    console.error('Upgrade Error:', err.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
