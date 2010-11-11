/**
 * Show .pre()/.post() hooks that yield
 *  - A serial flow control (by next()ing when the async code completes)
 *  - A parallel flow control (by next()ing immediately and fireing the done() callback
 *  when the task is completed
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
   .bool('blocked')
 
   .hook('custom', function(fn){
     console.log('custom hook');
     if(fn) fn();
   })
   .hook('custom', function(parent,callback){ // arguments are the same as 'hook' except parent has been prepended.
     console.log('overriding custom hook');
     parent(callback); // 
     //callback(); // if you want to skip default hook action.
   })
   .pre('custom', function(next,done){
     console.log('pre hook for custom');
     next();
   })
   .pre('custom', function(next, done){
     console.log('another pre hook for custom');
     next();
   });


 var User = mongoose.User;

 var tobi = new User({ name: { first: 'Tobi', last: 'ferret' }, age: 1 });
 
    tobi.custom(function(){
      console.log('callback');
      mongoose.disconnect();
    });