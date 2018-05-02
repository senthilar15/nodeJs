
console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async');
var User = require('./models/user');
var bcrypt = require('bcrypt');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
const saltRounds = 10;

function user_save(userid, username, password, role, cb) {
    
    var salt = bcrypt.genSaltSync(saltRounds);
    user = { 
      userid: userid,
      username: username,
      password: bcrypt.hashSync(password, salt),
      role: role
    }
    
      
    var user = new User(user);    
    user.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New user: ' + user);
      users.push(user)
      cb(null, user)
    }  );
  }



  function createUsers(cb) {
    async.parallel([
        function(callback) {
            user_save('admin', 'Admin User', 'admin', 'Admin', callback);
        },
        function(callback) {
            user_save('NormalUser', 'Normal user', 'user', 'User', callback);
        }
        ],
        // optional callback
        cb);
}

createUsers(function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Users : '+users);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


