const express = require('express');
const router = express.Router();
const auth = require('../utils/middleware');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/all-users', auth, async (req, res) => {
  try {
    const users = await User.find().sort({ created: 1 });

    if (!users) {
      return res.status(401).send({ error: [{ msg: 'No Users To Show' }] });
    }

    res.status(200).send({ users });
  } catch (error) {
    console.log(error);
  }
});

router.put('/profile/:id', auth, async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    city,
    country,
    state,
    phone_number,
    zipcode,
    address,
    password,
  } = req.body;
  try {
    const foundUser = await User.findById(req.params.id);
    const user = await User.findByIdAndUpdate(req.params.id, {
      city: city ? city : foundUser.city,
      country: country ? country : foundUser.country,
      state: state ? state : foundUser.state,
      phone_number: phone_number ? phone_number : foundUser.phone_number,
      zipcode: zipcode ? zipcode : foundUser.zipcode,
      address: address ? address : foundUser.address,
      password: password ? password : foundUser.password,
      firstname: firstname ? firstname : foundUser.firstname,
      lastname: lastname ? lastname : foundUser.lastname,
      email: email ? email : foundUser.email,
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

router.delete('/profile/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);

    res.status(200).json('user removed');
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

module.exports = router;
