var express = require('express');
var router = express.Router();

var config = require('config');
var passport = require('passport');
var redis = require('redis');
var client = redis.createClient(config.redis_port, config.redis_host);

/* GET home page. */
router.get('/login', passport.authenticate("twitter"));

router.get('/callback', passport.authenticate("twitter", {
  failureRedirect: "/"
}), function(req, res) {
  var user = req.user;
  client.hget(user.id, "name", function(err, val) {
    if(val == null) {
      client.hmset(user.id,
        "name", user.displayName,
        "img",  user.photos[0].value
      );
    } else {
      console.log("既に登録されています。");
    }
  });
  client.hkeys(user.id, function(err, val) {
    for(var key of val) {
      console.log(key);
      client.hget(user.id, key, function(err, value) {
        console.log("key: " + key + ", val: " + value);
      });
    }
  });
  res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
