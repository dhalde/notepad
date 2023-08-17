const express = require('express');
const AuthenticationController = require('../controllers/AuthenticationController')
const passport = require('passport')
const app = express();
const {notLoggedIn} = require('../middleware/authentication')

// const {notLoggedIn} = require('../middlewares/authentication')
  
//   app.post('/signup', notLoggedIn, AuthenticationController.signUp)
  
// app.post('/login', notLoggedIn, AuthenticationController.login)
  


  
  app.get('/auth/google', 
  passport.authenticate('google', {scope: ['email', 'profile','https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/tasks']})
  )

  app.get('/google/callback',
  passport.authenticate('google', {
        successRedirect:'/authRoutes/protected',
        failureRedirect: '/auth/failure',
        scope: ['email', 'profile','https://www.googleapis.com/auth/calendar']
  }),
  )
  
  app.get('/protected', notLoggedIn, (req, res) => {
    console.log('------api------')
    console.log(req.user);
    console.log('------------')
    AuthenticationController.googleCallback(req, res)
    res.send('Hello');
  })

  app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong...');
  })
  
 
  module.exports = app;