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
    res.render('users/index.hbs', { users: users, user: req.user})
  })
  .catch(function(err) {
    console.log(err)
  });
});

// CD NEW
// ==================================
router.get('/new', function(req, res){
  res.render('users/new');
});

// CD SHOW
// ==================================
router.get('/:id', function(req, res){
    res.render('users/show');
});

// CD CREATE
// ==================================
// router.post('/:id/cdLibrary', function(req, res){
//   User.findById(req.params.id, function(err, user){
//     user.cdLibrary.push(new Cd({body: req.body.newCd}))
//     user.save(function(err){
//       res.redirect(`/users/${user.id}`);
//     });
//   });
// });
// CD EDIT
// ==================================
// router.post('/:id/edit', function(req, res) {
//   console.log("Edit");
//   res.render('users/edit.hbs');
// })

// CD UPDATE
// ==================================
// router.put('/users/:id', function(req, res) {
//   console.log("update");
//   res.send("UPDATE");
// });

// CD DELETE
// ==================================
// router.delete('/users/:id', function(req, res) {
//   console.log("delete");
//   res.send("DELETE");
// });

// LOGOUT
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
