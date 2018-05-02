var express = require('express');
var user_controller = require('../controllers/usercontroller');
var router = express.Router();

router.get('/login', user_controller.user_login_get);


router.post('/login', user_controller.user_login_post);


router.get('/logout', function(req, res, next) {
  /*if(req.session){
       console.log('cominge here >>>>',req.session);
       req.session.destroy(function(err) {
         if(err){
           throw new Error;
         }
         next();
      })
       console.log('cominge here >>>>',req.session);
  }*/

  var token = req.cookies.jwtToken;
  if(token){
    res.clearCookie("jwtToken");
  }
  res.redirect('/users/login');
});


module.exports = router;
