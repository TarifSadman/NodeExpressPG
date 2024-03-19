const nodemailer = require('nodemailer');

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.SECRET_KEY
      }
    });

    const mailOptions = {
      from: `"Authentication Notifier" <${process.env.AUTH_EMAIL}>`,
      to: email,
      subject: 'OTP for Registration',
      text: `Your OTP for registration is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

module.exports = { sendOTP };
