// Is a little front end for various backend services

const express = require('express');
const app = express();
const request = require('request-promise-native');

const port = process.env.PORT || 3000;
const studentServer = process.env.STUDENT_SERVER;

// If the proper environment variable for the student api is not set, exit
if (studentServer === undefined) {
  console.log('Missing STUDENT_SERVER env parameter');
  process.exit(1);
}

function getLatestStudent() {
  // Request the latest student from the student server
  return request({
    uri: `http://${studentServer}/students?limit=1`,
    json: true
  });
}

function startHttpServer() {
  // On request get the latest student and return their name
  app.get('/', (req, res) => {
    getLatestStudent()
      .then(student => {
        if (typeof student === "object" && student.length > 0) {
          res.send(`Latest Student: ${student[0].name}`);
        } else {
          res.send('Not Student Found');
        }
      })
      .catch(err => {
        console.log(`Error while requesting the student server: ${studentServer}`);
        console.error(err);
      })
  });
  app.listen(port, () => console.log(`Gui app listening on port ${port}!`));
}

startHttpServer();


