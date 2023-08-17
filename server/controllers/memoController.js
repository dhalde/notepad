const express = require('express');
const {google} = require('googleapis');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();

// console.log(user.userDetails);
const app = express();

// Connect to the database

app.use(cookieParser());



// Function to add a new entry
async function addEntry(userId, title, url, dataTime, notes) {
    try {
      const existingMemo = await prisma.userMemoDetails.findFirst({
        where: {
          userId: userId,
          url: url,
        },
      });
    
      if (existingMemo) {
        console.log('Memo with the same URL already exists. Skipping creation.');
        return null; // Do not add the memo to the database
      }
    
      const userMemo = {
        title: title,
        url: url,
        dataTime: dataTime,
        notes: notes,
        userId: userId, // Associate the memo with the specific user
      };
    return await prisma.userMemoDetails.create({ data: userMemo });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function userMemoTask(res, title, url, dateTiming, notes, accessToken, refreshToken, taskListId){
  const oAuth2Client = new google.auth.OAuth2(
    process.env.Google_Client_ID,
    process.env.Google_Client_Secret
  );
  const userTokens = {
    access_token: accessToken,
    refresh_token: refreshToken
  };
  oAuth2Client.setCredentials(userTokens);

  const tasks = google.tasks({ version: 'v1', auth: oAuth2Client });

  const newTask = {
    title: title,
    description:`URL: ${url}\nNotes: ${notes}`,
    due: dateTiming,
    defaultReminders: [
      { method: 'email', minutes: 60 }, 
      { method: 'popup', minutes: 30 }
    ],
  };

  try {
    const response = await tasks.tasks.insert({ 
      requestBody: newTask,
      tasklist:taskListId
    });
    console.log(response);
    res.status(200).send('Event created');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error while adding entry' });
  }

}

// function userMemmoEvent(){

//   const oauth2Client = new google.auth.OAuth2(
//     process.env.Google_Client_ID,
//     process.env.Google_Client_Secret
//   );

//   const userTokens = {
//     access_token: req.cookies.accessToken?req.cookies.accessToken:req.headers.accesstoken,
//     refresh_token: req.cookies.refreshToken?req.cookies.refreshToken:req.headers.refreshtoken
//   };

//   oauth2Client.setCredentials(userTokens);

//   // Create a Calendar API client
//   const calendar = google.calendar('v3');

//   // Example: Create an event
//   const event = {
//     summary: title,
//     description:`URL: ${url}\nNotes: ${notes}`,
//     start: {
//       dateTime: dateTiming,
//       timeZone: 'Asia/Kolkata',
//     },
//     reminders: {
//       useDefault: false,
//       overrides: [
//           { method: 'email', minutes: 30 },
//           { method: 'popup', minutes: 15 }
//       ],
//   }
   
//   };
//   const startTime = new Date(event.start.dateTime);
//   const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
//   event.end = {
//     dateTime: endTime.toISOString(),
//     timeZone: 'Asia/Kolkata',
// };

//   calendar.events.insert(
//     {
//       auth: oauth2Client,
//       calendarId: 'primary',
//       resource: event,
//     },
//     (err, response) => {
//       if (err) {
//         console.error('Error creating event:', err);
//         res.status(500).send('Error creating event');
//         return;
//       }
//       console.log('Event created:', response.data);
//       res.status(200).send('Event created');
//     }
//   );
// }


 

const userMemo =  async (req, res) => {
  
    const { title, url, dataTime, notes, userId } = req.body;
    const dateTiming = new Date(dataTime).toISOString();
    try {
      // const user = req.user;
      const newEntry = await addEntry(userId, title, url, dateTiming, notes);
      
    

      //Calling Calendar Event function
      // userMemmoEvent(title, url,dateTiming, notes);
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          accessToken: true,
          refreshToken:true,
          taskListId: true
        },
      });

      await userMemoTask(res, title, url, dateTiming, notes, user.accessToken,user.refreshToken, user.taskListId)
    
     
      // res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ error: 'Error adding entry' });
    }
  }
  


module.exports = {userMemo};
