var express = require('express');
var fs = require("fs");
var app = express();
var async = require('async');
var CsvParser = require('./csv_parser');

app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder
app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/search/:place', (req,res) => {
  const place = req.params.place;
  const result = CsvParser.findString(place,res);
});

app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
})
