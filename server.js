// Create an express ap
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Password protection to prevent plagiarism
require('webTechLib')(app, {auth:true});

// Static data
app.use(express.static('public'));

// Automatically decode JSON bodies
app.use(bodyParser.json());

// Use the API subrouter
app.use('/api', require('./api'));

// Start accepting requests
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
 