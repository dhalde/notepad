const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function notLoggedIn(req, res, next) {
  const token = req.cookies['jwt'];
  if (token) {
    try {
      console.log('-----notloggedin-------') 
      console.log(req.user)
      const payload = jwt.verify(token, process.env.secret_key);
      if (payload && payload.user == req?.user.id) {
        console.log('-----payloaduser-------')
        console.log(payload.user);
        console.log('------------')
        const user = await prisma.user.findUnique({
          where: { id: payload.user },
          select: { id: true, email: true, name: true }, // Adjust fields as needed
        });

        if (user) {
          req.user = user;
          return res.status(400).json({
            msg: "Already logged in"
          });
        }
      }
    } catch (err) {
      next();
    }
  }

  next();
}

module.exports = {
  notLoggedIn
};
