const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

userInput = {}


// Starting instance of an app
const app = express()
app.use(cors())

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder (dist for Webpack)
app.use(express.static('../../dist'));

// ASK ZIL
app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// Setup Server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// ROUTES

app.get('/getData', function (req, res) {
    res.send(userInput);
});

app.post('/postData', function (req, res) {
    userInput = req.body;
    res.send('Post successful');
});