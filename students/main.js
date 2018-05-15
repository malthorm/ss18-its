// This small app manages student entries saved in a MongoDB

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL;

// If the proper environment variable for the database connection is not set, exit
if (mongoUrl === undefined) {
  console.error('Missing MONGO_URL env parameter');
  process.exit(1);
}

function connectMongoDb() {
  return new Promise(function (resolve) {
    MongoClient.connect(mongoUrl)
      .then(function (connection) {
        console.log(`Connected successfully to server`);

        // Use database named "core"
        const db = connection.db('core');

        // Close mongodb connection on process exit
        process.on('exit', () => {
          connection.close()
        });

        // Return database
        resolve(db);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      })
  });
}

function getStudentsFromDb(db, limit = 0) {
  return new Promise(function (resolve, reject) {
    const collection = db.collection('students');

    // Search for all students in the "students" collection and sort them by id
    collection.find({}).limit(limit).sort({ '_id': -1 }).toArray((err, students) => {
      if (err) {
        return reject(err);
      }

      // Return the students
      resolve(students);
    })
  });
}

function getStudents(req, res, db) {
  // Check for limit parameter and parse if necessary. getStudentsFromDb has a default limit value, so undefined is fine
  const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : req.query.limit;

  // Get the students from database and directly return them
  getStudentsFromDb(db, limit)
    .then(students => res.json(students))
    .catch(err => console.error(err));
}

function getIndex(req, res, db) {
  // Get the students from database and then return a small simple html page
  // containing an add form and a listing of already existing students

  getStudentsFromDb(db)
    .then(students => {
      res.send(`
<!doctype html>
<html>
  <head>
    <title>Admin</title>
  </head>
<body>
  <div>
    <h3>Add Student</h3>
    <form action="/students" method="post">
      Name: <input type="text" name="name">
      <input type="submit" value="Submit">
    </form>
  </div>
  <div>
    <h3>Existing Students</h3>
    <ul class="students">
    ${students.map(student => `<li>${student.name}</li>`).join('')}
    </ul>   
  </div>
  </body>
</html>`)
    });
}

function addStudent(req, res, db) {
  // Check if request body contains correct parameter
  if (typeof req.body.name !== "string" || /^([a-zA-Z\s]{1,50})$/.test(req.body.name) !== true) {
    return res.redirect('/');
  }

  // Insert student into the mongodb collection "students"
  const collection = db.collection('students');
  collection.insert({ name: req.body.name });

  // We simply redirect back to index so the page will show the newly added student
  res.redirect('/');
}

function startHttpServer(db) {
  // We have to use the bodyParser to be able to access request parameters (be it post, get, put, ...)
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // These are the expressjs routes, if a request hits one of these the corresponding function will be executed
  app.get('/', (req, res) => {
    getIndex(req, res, db)
  });
  app.get('/students', (req, res) => {
    getStudents(req, res, db)
  });
  app.post('/students', (req, res) => {
    addStudent(req, res, db)
  });

  // Start to listen on the defined port for requests
  app.listen(port, () => console.log(`Student app listening on port ${port}!`));
}

// If the MongoDb connection can not be established we exit
connectMongoDb()
  .then(startHttpServer)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });



