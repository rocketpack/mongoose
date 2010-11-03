
/**
 * Module dependencies.
 */

var assert = require('assert')
  , mongoose = require('mongoose')
  , Document = mongoose.Document
  , db = require('./common').db;

module.exports = {
  before: function(assert, done){
    db.onConnect(done);
  },

  'test connection path errors': function(){
      try{
        mongoose.connect('localhost/db');
      } catch(e){
        assert.ok(/include the mongodb/.test(e.message));
      }
      
      try{
        mongoose.connect('mongodb:///db')
      } catch(e){
        assert.ok(/provide a hostname/.test(e.message));
      }
      
      try{
        mongoose.connect('mongodb://localhost/')
      } catch(e){
        assert.ok(/provide a database/.test(e.message));       
      }
  },
  
  'test accessing a model from the mongoose singleton': function(){
    var document = mongoose.define;
    document('SingletonModel')
      .setters({
        'onekey': function(){},
        'twokey': function(){}
      })
      .indexes({ 'some.key': -1 });
    var instance = new mongoose.SingletonModel();

    assert.ok(instance instanceof mongoose.SingletonModel);
    assert.ok(instance instanceof Document);
  },
  
  'test accessing model statics': function(){
      var model = mongoose.SingletonModel;
      assert.ok(typeof model.find == 'function');
  },
  
  'test accessing instance of model': function(){
      var model = mongoose.SingletonModel;
          instance = new model();
          
      assert.ok(typeof instance._run == 'function');
      assert.ok(typeof instance.save == 'function');
  },
  
  'test defining a model name that conflicts with an internal method': function(){
    var document = mongoose.define,
        conflict = false;
    try {
      document('disconnect')
    } catch(e){
      if (/choose/.test(e.toString())) conflict = true;
    }
    assert.ok(conflict, 'There should be a name conflict');
  },
  
  teardown: function(){
    db.close();
  }
};