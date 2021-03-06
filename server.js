// MODULES
// ==================================
pry                 = require('pryjs')
var express         = require('express');
var mongoose        = require('mongoose');
var logger          = require('morgan');
var hbs             = require('hbs');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var app             = express();

// MODELS
// ==================================
var Schema = require('./models/user')
var User = Schema.User
var Cd = Schema.Cd

// MODULES
// ==================================
var usersController = require('./controllers/users.js')

// DATABASE CONNECTION
// ==================================
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/cd-library';
mongoose.connect(mongoURI);

// MIDDLEWARE / CONFIGURATION
// ==================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public')); // for css
app.set('view engine', 'hbs');

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTING MIDDLEWARE
// ==================================
app.use('/users', usersController );

// ROUTES
// ==================================

var hello = function(req, res, next) {
  console.log('hello');
  next()
};

// HOME
// ==================================
app.get('/', hello, function(req, res) {
  res.render('home');
});

// SERVER LISTENING ON PORT
// ==================================
app.listen(process.env.PORT || 3000);
