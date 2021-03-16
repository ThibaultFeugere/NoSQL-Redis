const createError = require('http-errors');
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('./config/config.json');
const redis = require('redis');

// Import of routes
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const otpRouter = require('./routes/otp');
const registerRouter = require('./routes/register');

const app = express();

const PORT = 1337;

app.listen(PORT, () => {
  console.log("✅ Express Node.js server running on port " + PORT)
})

const client = redis.createClient();

client.on("error", function(error) {
  console.error(`❗️ Redis Error: ${error}`)
})

client.on("ready", () => {
  console.log('✅ redis have ready !')
})

client.on("connect", () => {
  console.log('✅ connect redis success !')
})

// SMTP Test
nodemailer.createTransport(config.gmailConfig).transporter.verify(function(error, success) {
  if (error) {
    console.log(`❗️ SMTP Error: ${error}`);
  } else {
    console.log("✅ Server is ready to take our messages");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/otp', otpRouter);
app.use('/register', registerRouter);

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
  res.render('error');
});

module.exports = app;
