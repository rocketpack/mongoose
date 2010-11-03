
var mongoose = require('mongoose');

var db;
exports.__defineGetter__('db', function(){
  db = db || mongoose.connect('mongodb://localhost/mongoose');
  return db;
});