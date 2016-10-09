var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.Promise = global.Promise;

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
  updated_at: Date,
  cdLibrary: [cdSchema]
});

cdSchema.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
userSchema.methods.sayHello = function() {
    console.log("Hi " + this.username);
};

var Cd = mongoose.model('Cd', cdSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Cd: Cd
}
