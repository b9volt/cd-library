var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var cdSchema = new mongoose.Schema({
  artist: String,
  album: String,
  year: Number,
  genre: String
});
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  created_at: Date,
  updated_at: Date
});

cdSchema.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
userSchema.methods.sayHello = function() {
    console.log("Hi " + this.first_name);
};

var Cd = mongoose.model('Cd', cdSchema);
var User = mongoose.model('User', userSchema);

module.exports = User, Cd;
