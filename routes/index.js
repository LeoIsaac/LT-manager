var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var passport = req.session.passport;
  if(isLogin(passport)) {
    res.render('index', {
      name: passport.user.displayName,
      img: passport.user.photos[0].value,
      isLogin: true
    });
  } else {
    res.render('index', {
      isLogin: false
    });
  }
});

function isLogin(v) {
  return Boolean(
    typeof v == 'string' ? v && v != 0 : typeof v == 'object' ? v && Object.keys(v).length : v
  );
}

module.exports = router;
