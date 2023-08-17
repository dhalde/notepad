const express = require('express');
const app = express();
const passport = require('passport');
const memoController = require('../controllers/memoController');

// app.use(passport.authenticate('jwt', {session: false}))

 
app.post('/userMemo',memoController.userMemo)   


module.exports = app;
