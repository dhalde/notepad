const express = require('express');
const app = express();
const path = require('path'); 
require('dotenv').config();
require('./server/configure/passport_configure');
const session = require('express-session');
const userDetailRou = require('./server/routes/userDetails');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Allow non-secure cookies for testing
}));
app.use(cors({origin: true, credentials: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())

app.use('/userDetails', userDetailRou);
app.use('/authRoutes', require('./server/routes/authRoutes'))
app.get('/', (req, res) => {
  res.send(`<a href = "/authRoutes/auth/google"> Authenticate with Google </a>`)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});


