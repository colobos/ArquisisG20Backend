const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service (e.g., 'Outlook' or provide SMTP configuration)
  auth: {
    user: 'palvarezs169@gmail.com',
    pass: 'xlyt huzl nnas veqk', // specific app password from mail service
  },
});

// Function to send an email
const sendEmail = async (recipientEmail, subject, content) => {
  const mailOptions = {
    from: 'palvarezs169@gmail.com', // Your sender email address
    to: recipientEmail,
    subject: subject,
    text: content, // Plain text content
    // html: '<p>Your HTML content</p>', // HTML content (if needed)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
