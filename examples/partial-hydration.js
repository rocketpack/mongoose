/**
 * Demonstrate partial hydration in
 *  - Query syntax. Query the database for a few documents, and only partially
 *  hydrate them
 *  - Error handling. Try to .get() a key that has not been hydrated. 
 *  - Hydration checking. Call .hydrated('some.path') to check if a path is
 *  hydrated or not
 */


 var mongoose = require('../lib/mongoose')
   , document = mongoose.define;

 var db = mongoose.connect('mongodb://localhost/mongoose');

 document('User')
   .oid('_id')
   .object('name',
     document()
       .string('first')
       .string('last'))
   .object('contact',
     document()
       .string('email')
       .string('phone'))
   .number('age')
   .bool('blocked');
   
   
  var User = mongoose.User;
  
  var user = new User({
    name: { 
      first: 'Nathan',
      last: 'White'
    },
    contact: {
      email: 'nathan@learnboost.com',
      phone: '555-555-5555'
    },
    age: 33
  });
  
  user.save(function(err){
    
    User.find({ 'name.last': 'White' }, { contact: true }).one(function(err, doc){
      
      console.log("Name: " + JSON.stringify(doc.name));
      console.log("Age: " + doc.age);
      console.log("Contact: " + JSON.stringify(doc.contact));
      console.log('contact hydrated: ', doc.hydrated('contact'));
      console.log('contact.phone hydrated: ', doc.hydrated('contact.phone'));
      console.log('name hydrated: ', doc.hydrated('name'));
      
      User.drop(function(){
        db.close();
      });
      
    });
    
  });