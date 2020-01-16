require('dotenv').config()
const createError = require('http-errors');
const serverless = require('serverless-http')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
//ROUTES//
const email = require('./emailRoute');
const hello = require('./helloRoute');
//END ROUTES///
const cors = require('cors')
const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json({ limit: '200mb' }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  const origin = req.headers.origin
  res.set({
    "Access-Control-Allow-Origin": `${origin}`,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Origin, Authorization, X-Requested-With, Content-Type, Accept, X-Auth-Token"
  })

  // Print headers for debugging if necessary:
  //
  const debug = false
  if (debug) {
    const headers = res.getHeaders()
    const headerKeys = Object.keys(headers)
    console.log('Response Headers:')
    for (const header of headerKeys) {
      console.log(`   ${header} =  ${headers[header]}`)
    }
    console.log('End Response Headers')
    console.log()
  }
  next()
});
app.use('/v1/hello', hello);
app.use('/v1/email', email);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

//app.listen(port, () => console.log(`Server running on port ${port}!`))

module.exports.handler = serverless(app)
