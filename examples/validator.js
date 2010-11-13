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
        console.log('... isEmail validator (sync)');
        callback( /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) ); // sync test if value is in email format
      })
      .validate('isUnique', function(value, callback){ // second validator on same prop, async make sure its unique in db
        console.log('... isUnique validator (async)');
        this._model.find({email: value}).all(function(err,docs){
          callback(docs.length ? false : true);
        })
      })

 var User = mongoose.User;

 console.log('--- creating user 1 ---');
 user = new User({ email: 'test' }); // create new instance with invalid email
 console.log('--- saving user 1 ---');
 user.save(function(err,doc){ // save
   if(err){ // validator catches
     console.log('Save failed');
     console.log(err.message);
     // making email valid
     console.log('--- fixing user 1 ---');
     doc.email = 'test@me.com';
     // try and save again
     console.log('--- saving user 1 ---');
     doc.save(function(err,doc){
       if(err){
         console.log('something unexpected happened');
         console.log(err);
         close();
       } else { 
        // create a new instance with a duplicate email
        console.log('--- creating user 2 ---');
        console.log('--- saving user 2 ---');
        new User({ email: 'test@me.com' })
          .save(function(err,doc){ // save
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

/*
 Expected output:
 
 --- creating user 1 ---
 --- saving user 1 ---
 ... isEmail validator (sync)
 ... isUnique validator (async)
 Save failed
 validation isEmail failed for email
 --- fixing user 1 ---
 --- saving user 1 ---
 ... isEmail validator (sync)
 ... isUnique validator (async)
 --- creating user 2 ---
 --- saving user 2 ---
 ... isEmail validator (sync)
 ... isUnique validator (async)
 Save failed for second document
 validation isUnique failed for email

*/