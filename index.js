var express = require('express');
var fs = require("fs");
var app = express();
var async = require('async');
var CsvParser = require('./csv_parser');

app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/search/:place', (req,res) => {
  const place = req.params.place;
  const result = CsvParser.findString(place,res);
});


app.listen(3000, () => {
  console.log("Server running")
});
