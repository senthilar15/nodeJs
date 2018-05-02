var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalog = require('./routes/catalog');
var session = require('express-session');
var jwt = require('jsonwebtoken');

var mangoose  = require('./db');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(session({
  secret: 'aaft4t4grgthu6uhth5',
  resave: false,
  saveUninitialized: false
}));*/

app.all('*',function(req,res,next){
  console.log('>>>>>', req.url);
  if(!(req.url.endsWith('/login') || req.url ==='/' || req.url.endsWith('/logout'))){
   // console.log('Coming >>>> ',req.session.userid);
    //console.log('Cominge here >> ',req.session.userid);
    /*if(req.session && req.session.userid){
      console.log('user here >> ',req.session.userid);
      res.locals.userid = req.session.userid;
      next();
     }else{
       next(createError(401));
     }  */

     var token = req.cookies.jwtToken;
     console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
     if(token){
      // verify a token symmetric
        jwt.verify(token, 'secret', function(err, decoded) {
        console.log(decoded.userid) // bar
        next();
      });
     }else{
        next(createError(401));
     }

    // console.log('Coming >>>> ');
  }else{
    next();
  }

});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalog);





/*app.all('*',function(req,res,next){
  console.log('>>>>>');
  if(req && !req.url.startsWith('/users/login')){
    console.log('Coming >>>> ');
    console.log('Cominge here >> ',req.session.userid);
    if(req.session && req.session.userid){
      console.log('Cominge here >> ',req.session.userid);
      res.locals.userid = req.session.userid;
      next();
     }else{
      res.redirect('/users/login');
     }
  }
  
});*/

/*app.use(function(req,res,next){
  
  console.log(req.session)
  if(req.session && req.session.userid){
     res.locals.userid = req.session.userid;
     next();
    }else{
      console.log('Coming here')
      res.redirect('/users/login');
    }
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log('AA>>>>>AA'+err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
