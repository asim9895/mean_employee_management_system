const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

router.post(
  '/register',
  [
    check('firstname').not().isEmpty().withMessage('First name is required'),
    check('lastname').not().isEmpty().withMessage('Last name is required'),
    check('address').not().isEmpty().withMessage('Address is required'),
    check('city').not().isEmpty().withMessage('City is required'),
    check('state').not().isEmpty().withMessage('State is required'),
    check('country').not().isEmpty().withMessage('Country is required'),
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('password')
      .isLength({ min: 6, max: 12 })
      .withMessage('your password should have min and max length between 6-12')
      .matches(/\d/)
      .withMessage('your password should have at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('your password should have at least one special character')
      .matches(/[A-Z]/)
      .withMessage('your password must contain atleast one capital letter'),
    check('phone_number')
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must only be of 10 numbers'),
    check('zipcode')
      .isLength({ max: 10 })
      .withMessage('zipcode must only be of 10 numbers'),
  ],
  async (req, res) => {
    const {
      firstname,
      lastname,
      email,
      password,
      city,
      state,
      phone_number,
      zipcode,
      country,
      address,
      confirmPassword,
    } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(401).send({ error: errors.array() });
      }
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(401)
          .send({ error: [{ msg: 'User Already Exists' }] });
      }

      if (password !== confirmPassword) {
        return res
          .status(401)
          .send({ error: [{ msg: "Password Does'nt Match" }] });
      }

      user = new User({
        firstname,
        lastname,
        email,
        password,
        city,
        address,
        country,
        state,
        phone_number,
        zipcode,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, async (err, token) => {
        if (err) throw Error(err);

        res.status(200).json(token);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('server error');
    }
  }
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('password').not().isEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).send({ errors: errors.array() });
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).send({ error: [{ msg: 'User does not Exists' }] });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send({ error: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, jwtSecret, async (err, token) => {
      if (err) throw Error(err);

      res.status(200).json(token);
    });
  }
);

module.exports = router;
