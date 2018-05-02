var bcrypt = require('bcrypt');
var User = require('../models/user');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var jwt = require('jsonwebtoken');



const saltRounds = 10;

exports.user_login_get = function(req, res, next){
   
    res.render('login_form', { title: 'Login'});
}

// Display book update form on GET.
exports.user_login_post = [

    // Validate fields.
    body('userid', 'UserId must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must not be empty.').isLength({ min: 1 }).trim(),
    
     // Sanitize fields.
     sanitizeBody('userid').trim().escape(),
     sanitizeBody('password').trim().escape(),
 
     // Process request after validation and sanitization.
     (req, res, next) => {
 
         // Extract the validation errors from a request.
         const errors = validationResult(req);
 
         // Create a Book object with escaped/trimmed data and old id.
         var user = new User(
           { userid: req.body.userid });
 
         if (!errors.isEmpty()) {
            
            res.render('login_form', { title: 'Login',user:user,errors: errors.array() });
             return;
         }
         else {
          
            // Data from form is valid. Update the record.
             User.findOne({ 'userid': req.body.userid })
                .exec( function(err, found_user) {
                    if (err) { return next(err); }

                    if (found_user) {
                            /*bcrypt.compare(req.body.password, found_user.password).then(function(result) {
                                if(result == true){
                                    console.log('Coming here >>'+ req.body.userid)
                                    req.session =  req.session ? req.session : {};
                                    req.session.userid = req.body.userid;
                                    res.redirect('/catalog');
                                }else{
                                    res.redirect('/users/login');
                                }
                            });*/

                            jwt.sign({ userid: req.body.userid }, 'secret', function(err, token) {
                                if (err) { return next(err) };
                                    console.log(token);
                                    var cookie = req.cookies.jwtToken;
                                    if (!cookie) {
                                      res.cookie('jwtToken', token, { maxAge: 900000, httpOnly: true });
                                      res.redirect('/catalog');
                                    } 
                              });
            
                    }
                    else {

                        res.redirect('/users/login');

                    }

              });
   
         }
     },

     
 ];
