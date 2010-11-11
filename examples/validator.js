/**
 * Demonstrate validators by
 *  - Passing a document whose email is asynchronously verified as unique and
 *  failing
 *  - Then on the save() callback, examine the error, fix the email by making
 *  it random, and saving again
 */

 var mongoose = require('../lib/mongoose')
   , document = mongoose.define;

 var db = mongoose.connect('mongodb://localhost/mongoose');

 document('User')
   .oid('_id')
   .string('email')
      .validate('isEmail', function(value, callback){
        callback( /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) );
      })
      .validate('isUnique', function(value, callback){
        this._model.find({email: value}).all(function(err,docs){
          callback(docs.length ? false : true);
        })
      })

 var User = mongoose.User;

 user = new User({ email: 'test' });
 user.save(function(err,doc){
   if(err){
     console.log('Save failed');
     console.log(err.message);
     doc.email = 'test@me.com'; // making email valid
     doc.save(function(err,doc){
       if(err){
         console.log('something unexpected happened');
         console.log(err);
         close();
       } else {
        new User({ email: 'test@me.com' })
          .save(function(err,doc){
            if(err){
              console.log('Save failed for second document');
              console.log(err.message);
            }
            close();
          });
       }
     })
   }
 });
 
 
function close() {
   User.drop(function(){
     db.close();
   });
}