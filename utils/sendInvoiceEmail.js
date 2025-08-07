const sendInvoiceEmail = async (email, plan, amount) => {
  console.log(`Sending invoice email to ${email} for ${plan} plan worth ₹${amount}`);
  // Email logic will be added later with nodemailer
};

module.exports = { sendInvoiceEmail };
