var express = require('express');
var wagner = require('wagner-core');

require('./models.js')(wagner);
require('./dependencies')(wagner);

var app = express();

app.use(require('morgan')());

wagner.invoke(require('./auth'), { app: app });

app.use('/api/v1', require('./api')(wagner));

// Serve up static HTML pages from the file system.
// For instance, '/6-examples/hello-http.html' in
// the browser will show the '../6-examples/hello-http.html'
// file.
app.use(express.static('public', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

//app.listen(3000);
var port = process.env.PORT || 80;
app.listen(port);
console.log('Listening on port ' + port + '!');
