var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));
var port = process.env.PORT || 8000;
app.listen(port);