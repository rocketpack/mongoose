var assert = require('assert')
  , mongoose = require('mongoose').new()
  , document = mongoose.define
  , db = mongoose.connect('mongodb://localhost/mongoose_test');

document('Group')
  .oid('_id')
  .string('name')
  .array('items');
  
document('User')
  .oid('_id')
  .string('name')
  .array('friends');
  
var Group = mongoose.Group;
var User = mongoose.User;

module.exports = {
  
  before: function(assert, done){
    Group.drop(done);
  },
  
  'test embeddedArray insertion': function(assert, done){
    new Group({
      name: 'Oceans', 
      items: ['Pacific']
    })
    .save(function(err, doc){
      assert.ok(!err);
      assert.length(doc.items, 1);
      done();
    }) 
  },
  
  'test embeddedArray insertion (hydration)': function(assert, done){
    new Group({
      name: 'Oceans', 
      items: ['Pacific', 'Alantic']
    })
    .save(function(err, doc){
      assert.ok(!err);
      assert.length(doc.items, 2);
      done();
    }) 
  },
  
  'test embeddedArray Array pop()': function(assert, done){
    Group.withItems('Alantic').all(function(err, docs){
      assert.ok(!err);
      assert.length(docs, 1);
      assert.length(docs[0].items, 2);
      docs[0].items.pop();
      assert.length(docs[0].items, 1);
      docs[0].save(function(err, doc){
        assert.ok(!err);
        Group.withItems('Alantic').all(function(err, docs){
          assert.ok(!err);
          assert.length(docs, 0);
          done()
        });
      });
    })
  },
  
  'test embeddedArray Array push()': function(assert, done){
    
    Group.find().all(function(err,docs){
      assert.ok(!err);
      assert.length(docs, 2);
      docs[0].items.push('Indian');
      docs[0].save(function(err,doc){
        Group.withItems('Indian').all(function(err, doc){
          assert.ok(!err);
          assert.length(doc[0].items, 2)
          done();
        })
      })
    })
  },
  
  'test embeddedArray Casting': function(assert, done){
    
    var chris = new User({ name: 'Chris', friends: [] });
      
    chris.friends.push('id')
    chris.save(function(err, doc){
        assert.ok(!err);
        done();
      });
    
  },
  
  
  teardown: function(){
    mongoose.disconnect();
  }  
};