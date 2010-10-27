var assert = require('assert')
  , mongoose = require('mongoose')
  , document = mongoose.define
  , db = mongoose.connect('mongodb://localhost/mongoose_index_tests');

document('Actor')
  .oid('_id')
  .string('firstName')
  .string('lastName');

var filmSchema = 
  document('Film')
    .oid('_id')
    .number('imdbId')
    .string('title')
      .index()
    .string('rating')
    .boolean('is3D')
    .boolean('isDolby')
    .object('leadActor', mongoose.Actor)
    .object('leadActress', mongoose.Actor)
      .index()
//    .object('supportingActress', mongoose.Actor)
//      .index('firstName')
    .array('cast', mongoose.Actor)
      .index()
    .addIndex({rating: -1})
    .addIndex({'leadActor.firstName': 1})
    .addIndex({is3D: 1, isDolby: -1})
    .addIndex({imdbId: 1}, {unique: true});

var Film = mongoose.Film;

// TODO Background index building?
module.exports = {
  setup: function (done) {
    done();
  },
  'the schema should be able to retrieve its indexes declared via type definition': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[0], [['title', 1]]);
      done();
    });
  },
  'the schema should be able to retrieve its indexes declared via schema definition': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[3], [['rating', -1]]);
      done();
    });
  },
  'embedded key indexes should register with mongodb': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[4], [['leadActor.firstName', 1]]);
      done();
    });
  },
  'documents as indexes should register with mongodb': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[1], [['leadActress', 1]]);
      done();
    });
  },
  'compound indexes should register with mongodb': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[5], [['is3D', 1], ['isDolby', -1]]);
      done();
    });
  },
  'array indexes should register with mongodb': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[2], [['cast', 1]]);
      done();
    });
  },
  'unique indexes should register with mongodb and cause a double insertion to throw an error': function (assert, done) {
    Film.indexes(true, function (indexes) {
      assert.deepEqual(indexes[6], [['imdbId', 1]]);
      new Film({imdbId: 1}).save( function (errors1, film1) {
        new Film({imdbId: 1}).save( function (errors2, film2) {
          console.log(errors2);
          assert.isNotNull(errors2);
          // TODO Error is not being thrown!
          done();
        });
      });
    });
  },

  // TODO
//  'the schema should be able to re-index': function () {
//    filmSchema.reIndex();
//  },
  //  TODO
//  'mongoose should be able to retrieve ALL indexes': function () {
//  },
  //  TODO
//  'the schema should be able to drop a single index': function () {
//    filmSchema.dropIndex({TODO: 'TODO'});
//  },
  //  TODO
//  'the schema should be able to drop all indexes': function () {
//    filmSchema.dropIndexes();
//  },
  teardown: function(){
//    Film.drop(function () {
      db.close();
//    });
  }
};
