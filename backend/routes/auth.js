const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Make sure you have a User model
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ msg: 'Login successful' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

module.exports = router;
