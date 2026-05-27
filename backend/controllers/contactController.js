const { sendContactEmail } = require('../utils/emailService');

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Name, email and message are required' });

    const previewUrl = await sendContactEmail(email, name, subject, message);
    res.status(200).json({ success: true, message: 'Message sent', previewUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
};
