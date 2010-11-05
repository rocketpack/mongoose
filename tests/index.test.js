var assert = require('assert')
  , mongoose = require('mongoose').new()
  , Document = mongoose.Document
  , db = mongoose.connect('mongodb://localhost/mongoose_tests');
  
function timeout(goose){
  return setTimeout(function(){
    assert.ok(false, 'Connection timeout');
  },5000);
}


module.exports = {

  'test connecting to mongodb': function(assert, done){
    var mongoose = require('mongoose').new(),
        timer = timeout(mongoose);
    mongoose.connect('mongodb://localhost/mongoose_connect', function(err){
      clearTimeout(timer);
      assert.ok(mongoose.connected, 'It should connect using uri / callback signature');
      
      mongoose.disconnect(function(){
        assert.ok(!mongoose.connected);
        
        var timer = timeout(mongoose);
        mongoose.connect('mongodb://localhost/mongoose_connect', { some: 'option' }, function(){
          clearTimeout(timer);
          assert.ok(mongoose.connected, 'It should connect using uri / options / callback signature');
          mongoose.disconnect(function(){
            assert.ok(!mongoose.connected);
            done();
          });
        });
      });
    });
  },
 
  'test connection path errors': function(assert, done){
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
      done();
  },
  
  'test accessing a model from the mongoose singleton': function(assert, done){
    var document = mongoose.define;
    document('SingletonModel')
      .setters({
        'onekey': function(){},
        'twokey': function(){}
      })
      .indexes({ 'some.key': -1 });
    var instance = new mongoose.SingletonModel();

    assert.ok(instance instanceof mongoose.SingletonModel);
 //   assert.ok(instance instanceof Document);
    done();
  },
  
  'test accessing model statics': function(assert, done){
      var model = mongoose.SingletonModel;
      assert.ok(typeof model.find == 'function');
      done();
  },
  
  'test accessing instance of model': function(assert, done){
      var model = mongoose.SingletonModel;
          instance = new model();
          
      assert.ok(typeof instance._run == 'function');
      assert.ok(typeof instance.save == 'function');
      done();
  },
  
  'test defining a model name that conflicts with an internal method': function(assert, done){
    var document = mongoose.define,
        conflict = false;
    try {
      document('disconnect')
    } catch(e){
      if (/choose/.test(e.toString())) conflict = true;
    }
    assert.ok(conflict, 'There should be a name conflict');
    done();
  },
  
  teardown: function(){
    mongoose.disconnect();
  }
  
};
