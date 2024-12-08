const nodemailer = require('nodemailer');
const crypto = require('crypto');

let otpStore = {};

const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587, 
    auth: {
        user: 'api', 
        pass: '' 
    }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to Mailtrap:', error);
  } else {
    console.log('Successfully connected to Mailtrap');
  }
});

exports.sendOtp = (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
  
    otpStore[email] = otp;
  
    const mailOptions = {
      from: 'hello@demomailtrap.com',
      to: email,
      subject: 'Mã OTP Của Bạn',
      text: `Mã OTP dùng để thay đổi mật khẩu của bạn là ${otp}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        res.status(200).json({ message: 'OTP sent successfully' });
      });
  };

  exports.verifyOtp = (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    if (otpStore[email] === otp) {
      delete otpStore[email];
      res.status(200).json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  };
