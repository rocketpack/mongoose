/**
 * Demonstrate atomic $push to an array
 *  1) Retrieve a document
 *  2) Run a for loop from 1 to 100, pushing each index into the array that was
 *  marked as atomic. Call .save() on each iteration
 *  3) When all 100 callbacks are fired, re-fetch the document and asser that
 *     - The length of the array is 100
 *     - The order of the items is the expected one
 */

 var assert = require('assert')
   , mongoose = require('../lib/mongoose').new()
   , document = mongoose.define
   , db = mongoose.connect('mongodb://localhost/mongoose_test');

 document('Atomic')
   .oid('_id')
   .string('name')
   .array('items').atomic(true);
   
   
  var Atomic = mongoose.Atomic
    , atomic = new Atomic({ name: 'atomic', items: [] })
    , loop = 100;
  
  for(var i = 0, l = loop; i < l; i++){
    atomic.items.push(i);
    atomic.save(function(err, doc){
      if(err) console.log('this should not happen!');
      if(--loop === 0){
        // And were done
        // lets check the results
        Atomic.find('name', 'atomic').one(function(err, doc){
          if(err) console.log('oh no!');
          
          assert.equal(doc.items.length, 100);
          
          for(var j = 0, k = 100; j < k; j++){
            assert.equal(doc.items.get(j), j);
          }
          
          console.log('it worked!');
          mongoose.disconnect();
          
        });
      }
    })
  }
   
   
