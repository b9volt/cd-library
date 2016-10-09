// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/cd-library');
// var Schema = require('../models/user');
//
// var User = Schema.User;
// var Cd = Schema.Cd;
// User.remove({}, function(err){
//     console.log(err)
// });
//
// Cd.remove({}, function(err){
//     console.log(err)
// });
//
// var brad = new User({name: "brad"})
// var shelly = new User({name: "shelly"})
// var tom = new User({name: "tom"})
//
// var cd1 = new Cd({artist: "Nirvana", album: "Nevermind", year: 1991, genre: "Grunge"})
// var cd2 = new Cd({artist: "Pixies", album: "Surfer Rosa", year: 1988, genre: "College rock"})
// var cd3 = new Cd({artist: "Sonic Youth", album: "Daydream Nation", year: 1991, genre: "Indie rock"})
// var cd4 = new Cd({artist: "Pavement", album: "Slanted and Enchanted", year: 1992, genre: "Indie rock"})
// var cd5 = new Cd({artist: "Fugazi", album: "13 Songs", year: 1989, genre: "Post-punk"})
// var cd6 = new Cd({artist: "Superchunk", album: "On the Mouth", year: 1991, genre: "Indie rock"})
//
// var users = [brad, shelly, tom]
// var cds = [cd1, cd2, cd3, cd4, cd5, cd6]
//
// for(var i = 0; i < users.length; i++){
//     users[i].cds.push(cds[i], cds[i+3])
//
//     users[i].save(function(err){
//         if (err){
//             console.log(err)
//         }else {
//             console.log("user was saved")
//         }
//     })
// }
