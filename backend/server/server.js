const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDb = require('../database/mongoose');
const user = require('../routes/user');
const profile = require('../routes/profile');
const admin = require('../routes/admin');
const app = express();
const port = process.env.PORT || 4500;

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type, Authorization'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(morgan('dev'));
app.use('/api', user);
app.use('/api', profile);
app.use('/api/admin', admin);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
