const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./src/routes/routes')(app, fs);


app.listen(3000, () => {
    console.log("Server running on port 3000");
});




