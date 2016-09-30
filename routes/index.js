var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(notEmpty(req.session.passport)) {
    res.render('index', { title: "Welcome to " + req.session.passport.user.displayName });
  } else {
    res.render('error', {
      message: 'Please login',
      error: {}
    });
  }
});

function notEmpty(v) {
  return Boolean(
    typeof v == 'string' ? v && v != 0 : typeof v == 'object' ? v && Object.keys(v).length : v
  );
}

module.exports = router;
