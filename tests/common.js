
var mongoose = require('mongoose');

var db;
exports.__defineGetter__('db', function(){
  db = db || mongoose.connect('mongodb://localhost/mongoose');
  db.onConnect = function(fn){
    if (this.connected) {
      fn();
    } else {
      this.on('connect', fn);
    }
  };
  return db;
});