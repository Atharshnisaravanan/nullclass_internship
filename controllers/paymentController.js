const User = require('../models/User');
const { sendInvoiceEmail } = require('../utils/sendInvoiceEmail');

const planPrices = {
  Bronze: 10,
  Silver: 50,
  Gold: 100,
};

const upgradePlan = async (req, res) => {
  const { email, selectedPlan } = req.body;

  if (!planPrices[selectedPlan]) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    // Mocking payment success
    console.log(`Mock payment of ₹${planPrices[selectedPlan]} for ${selectedPlan} plan`);

    // Update user plan
    user.plan = selectedPlan;
    await user.save();

    // Mock send invoice email
    await sendInvoiceEmail(email, selectedPlan, planPrices[selectedPlan]);

    res.json({ message: 'Plan upgraded successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { upgradePlan };
