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
 
   .hook('serialFlow', function(fn){
     console.log('serialFlow hook');
     if(fn) fn();
   })
   .hook('serialFlow', function(parent,callback){ // arguments are the same as 'hook' except parent has been prepended.
     console.log('overriding serialFlow hook');
     parent(callback); // 
     //callback(); // if you want to skip default hook action.
   })
   .pre('serialFlow', function(next,done){
     console.log('... pre hook for serialFlow');
     setTimeout(function(){
       console.log('... pre hook for serialFlow (done) ...');
       next();
     }, 500);
   })
   .pre('serialFlow', function(next, done){
     console.log('... another pre hook for serialFlow')
     setTimeout(function(){
       console.log('... another pre hook for serialFlow (done) ...');
       next();
     }, 500);
   })

   .hook('parallelFlow', function(fn){
     console.log('parallelFlow hook');
     if(fn) fn();
   })
   .hook('parallelFlow', function(parent,callback){ // arguments are the same as 'hook' except parent has been prepended.
     console.log('overriding parallelFlow hook');
     parent(callback); // 
     //callback(); // if you want to skip default hook action.
   })
   .pre('parallelFlow', function(next,done){
     console.log('... pre hook for parallelFlow');
     setTimeout(function(){
       console.log('... pre hook for parallelFlow (done) ...');
     }, 500);
     next();
   })
   .pre('parallelFlow', function(next, done){
     console.log('... another pre hook for parallelFlow')
     setTimeout(function(){
       console.log('... another pre hook for parallelFlow (done) ...');
     }, 500);
     next();
   })



 var User = mongoose.User;

 var tobi = new User({ name: { first: 'Tobi', last: 'ferret' }, age: 1 });
 
    console.log('==== calling serialFlow hook ====');
    tobi.serialFlow(function(){
      console.log('callback for serialFlow');
      console.log('');
      
      console.log('==== calling parallelFlow hook ====');
      tobi.parallelFlow(function(){
        console.log('callback for parallelFlow');
        mongoose.disconnect();
      });

    });
    
/*
Expected output:

==== calling serialFlow hook ====
... pre hook for serialFlow
... pre hook for serialFlow (done) ...
... another pre hook for serialFlow
... another pre hook for serialFlow (done) ...
overriding serialFlow hook
serialFlow hook
callback for serialFlow

==== calling parallelFlow hook ====
... pre hook for parallelFlow
... another pre hook for parallelFlow
overriding parallelFlow hook
parallelFlow hook
callback for parallelFlow
... pre hook for parallelFlow (done) ...
... another pre hook for parallelFlow (done) ...

*/