var http = require('http')
    , app = require('./config/express');

const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, function () {
  console.log('API escutando na porta: ' + this.address().port);
});

