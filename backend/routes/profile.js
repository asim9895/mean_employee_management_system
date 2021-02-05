const express = require('express');
const auth = require('../utils/middleware');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(401).send({ errors: [{ msg: 'User Not Found' }] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send('server error');
  }
});

router.put('/profile', auth, async (req, res) => {
  const {
    city,
    country,
    state,
    phone_number,
    zipcode,
    address,
    password,
  } = req.body;
  try {
    const foundUser = await User.findById(req.user.id);
    const user = await User.findByIdAndUpdate(req.user.id, {
      city: city ? city : foundUser.city,
      country: country ? country : foundUser.country,
      state: state ? state : foundUser.state,
      phone_number: phone_number ? phone_number : foundUser.phone_number,
      zipcode: zipcode ? zipcode : foundUser.zipcode,
      address: address ? address : foundUser.address,
      password: password ? password : foundUser.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json('user updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

router.delete('/profile', auth, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user.id);

    res.status(200).json('user removed');
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

module.exports = router;
