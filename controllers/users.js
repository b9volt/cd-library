var express       = require('express');
var router        = express.Router();
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Schema        = require('../models/user');

var User = Schema.User;
var Cd = Schema.Cd;

// SIGNUP
// ==================================
router.get('/signup', function(req, res) {
  res.render('users/signup');
})

router.post('/signup', function(req, res) {
  User.register(new User(
    { username : req.body.username}),
    req.body.password, function(err, user) {
      if (err) {
        return res.json({ user : user });
      }

      // passport.authenticate('local')(req, res, function () {
        res.redirect('/users/login');
      // });
    });
});

// LOGIN
// ==================================
router.get('/login', function(req, res) {
  console.log(req.session)
  res.render('users/login');

});

router.post('/login', passport.authenticate('local'), function(req, res) {
  req.session.save(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/users');
  });
});

// USER INDEX
// ==================================
router.get('/', function(req, res) {
  var query = User.find({});

  query.then(function(users) {
    res.render('users/index', { users: users, user: req.user})
  })
  .catch(function(err) {
    console.log(err)
  });
});

// CD NEW
// ==================================
router.get('/new/:id', function(req, res){
  var query = User.findById({_id: req.params.id})
  query.then(function(user) {
    // console.log(user.cdLibrary);
    res.render('users/new', {user: user});

  })

  .catch(function(err) {
    res.json({message: 'nope' + err});
  });

});

// CD CREATE
// ==================================
router.post('/new/cd', function(req, res){
  var userId = req.body.userId;

  var newCd = new Cd({
      artist: req.body.artist,
      album: req.body.album,
      year: req.body.year,
      genre: req.body.genre
  });

  User.findByIdAndUpdate(
    userId,
    {$push: {cdLibrary: newCd}},
    {safe: true, upsert: true},
    function(err, user) {
      if (err) {
        console.log(err);
      } else{
        res.redirect('/users/show/'+ userId)
      }
    }
);
});

// CD SHOW
// ==================================
router.get('/show/:id', function(req, res){
    var query = User.findById({_id: req.params.id})
    query.then(function(user) {
      // console.log(user.cdLibrary);
      console.log(user);
      res.render('users/show', {user: user});

    })
    .catch(function(err) {
      res.json({message: 'nope' + err});
    });
});

// CD EDIT
// ==================================
router.get('/edit', function(req, res) {
  res.render('users/edit');
});

// CD UPDATE
// ==================================
// router.put('/users/:id', function(req, res) {
//   console.log("update");
//   res.send("UPDATE");
// });

// CD DELETE
// ==================================
router.delete('/delete/:userid/:id', function(req, res){
  var userId = req.body.userId;
  console.log("I am deleting!")
    User.findByIdAndUpdate(req.params.userid, {
      $pull: {
        cdLibrary: {_id: req.params.id}
      }
    }, function(err) {
      res.redirect('/users/show/'+ userId)
    });
});


// USER LOGOUT
// ==================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users');
});

// IF NOT USER
// ==================================
var authenticate = function(req, res, next) {
  if (!req.user || req.user._id != req.params.id) {
    res.json({status: 401, message: 'unauthorized'})
  } else {
    next()
  }
}

// IF USER SHOW
// ==================================
router.get('/:id', function(req, res) {
  if (!req.user || req.user._id != req.params.id) {
    res.json({status: 401, message: 'unauthorized'})
  } else {
    var query = User.findById({_id: req.params.id})
    query.then(function(user) {
      // console.log(user.cdLibrary);
      // res.render('users/show.hbs', {user: user});
      res.json(user)
    })
    .catch(function(err) {
      res.json({message: 'nope' + err});
    });
  }
});

module.exports = router;
