const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const googleCallback = async (req, res) => {
    console.log('-----req-------')
    console.log(req.user);
    console.log('------------')

    const user = req.user;
    const token = jwt.sign({user: user.id}, process.env.secret_key)
    res.cookie('jwt', token)
    // res.cookie('accessToken', user?.accessToken);
    // res.cookie('refreshToken', user.refreshToken ? user?.refreshToken:'');
  }
  

  module.exports = {googleCallback}