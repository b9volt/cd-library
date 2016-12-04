var express       = require('express');
var router        = express.Router();
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Schema        = require('../models/user');

var User = Schema.User;
var Cd = Schema.Cd;

// USER SIGNUP
// ==================================
router.get('/signup', function(req, res) {
  res.render('users/signup');
})

router.post('/signup', function(req, res) {
  User.register(new User({ username : req.body.username}),
    req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.json({ error: err });
      }
      res.redirect('/users');
    });
});

// USER LOGIN
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

// USER LOGOUT
// ==================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users');
});

// CD NEW
// ==================================
router.get('/new/:id', function(req, res){
  var query = User.findById({_id: req.params.id})
  query.then(function(user) {
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
    console.log(user);
    res.render('users/show', {user: user});

  })
  .catch(function(err) {
    res.json({message: 'nope' + err});
  });
});

// CD EDIT
// ==================================
router.get('/:userid/edit/:id', function(req, res){
  console.log("I am editing!")
  var cd = req.params.id;
  User.findById({_id: req.params.userid}, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      var cdToEdit = user.cdLibrary[cd];
      cdToEdit.cdid = req.params.id;
      res.render('users/edit', { user: user, cdToEdit: cdToEdit
     });
   }
  });
});

// CD UPDATE
// ==================================
router.post('/:userid/edit/:cdid', function(req, res){
  var cdid = req.body.cdid;
  var userid = req.params.userid;

  User.findById(userid,
    function(err, user) {
    user.cdLibrary[cdid] = req.body;

    user.save(function (err, newCd){
      if(err) return err;
      res.redirect('/users/show/'+ userid);
    })

  });
});

// CD DELETE
// ==================================
router.delete('/:userid/delete/:id', function(req, res){
  console.log(req.body)
    User.findByIdAndUpdate(req.params.userid, {
      $pull: {
        cdLibrary: {_id: req.params.id}
      }
    }, function(err) {
      res.redirect('/users/show/' + req.params.userid)
    });
});

// AUTHENTICATION
// ==================================
var authenticate = function(req, res, next) {
  if (!req.user || req.user._id != req.params.id) {
    res.json({status: 401, message: 'unauthorized'})
  } else {
    next()
  }
}

router.get('/:id', function(req, res) {
  if (!req.user || req.user._id != req.params.id) {
    res.json({status: 401, message: 'unauthorized'})
  } else {
    var query = User.findById({_id: req.params.id})
    query.then(function(user) {
      res.json(user)
    })
    .catch(function(err) {
      res.json({message: 'noper ' + err});
    });
  }
});

module.exports = router;
