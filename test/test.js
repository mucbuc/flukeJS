#!/usr/bin/env node

var assert = require( 'assert' )
  , fluke = require( '../fluke' )
  , Expector = require( 'expector' ).Expector;

assert( typeof fluke !== 'undefined' );

suite( 'regression', function() {
  test( 'bug fix', function() {
    splitAll( 'namespace hello\n{}', { 'open': '{' } )
      .expect( 'open', {"lhs":"namespace hello\n","rhs":"}","token":"{","stash":""} )
      .run();
  }); 
}); 

suite( 'splitNext', function(){
  test( 'should match token with event', function() {
    splitNext( ';' )
      .expect( 'statement' )
      .run(); 
  });
});

suite( 'splitAll', function(){
  test( 'should match multiple tokens with event', function() {
    splitAll( '{;', { 'open': '{', 'statement': ';' } )
      .expect( 'open' )
      .expect( 'statement' )
      .run(); 
  });

  test( 'process multiple lines', function() {
    splitAll( 'abc; abc;', { 'statement': ';' } )
      .expect( 'statement' )
      .expect( 'statement' )
      .run(); 
  });
});

suite( 'splitEmpty', function(){
  test( 'should emit end on empty source', function() {

    splitNext( '' )
      .expect( 'end', { lhs: '' } )
      .run(); 

    splitAll( '' )
      .expect( 'end', { lhs: '', stash: '' } )
      .run();
  });

  test( 'should end without token', function() {
    splitNext( '{', {} )
      .expect( 'end', { lhs: '{' } )
      .run();

    splitAll( '{', {} )
      .expect( 'end', { lhs: '{', stash: '' } )
      .run();
  }); 

  test( 'should emit end', function() {
    splitNext( '', {} )
      .expect( 'end', { lhs: '' } ) 
      .run(); 
    
    splitAll( '', {} )
      .expect( 'end', { lhs: '', stash: '' } )
      .run();
  });
});

suite( 'consume', function(){
  test( 'should consume the ; token', function() {

    var emitter = new Expector();
    emitter.expect( 'open' );
    emitter.expectNot( 'statement' );
    emitter.on( 'end', function() {
        emitter.check();
      } );
    
    fluke.splitAll( '{;', function( type, response ) { 
        if (type !== 'end') 
          response.consume( 1 );
        emitter.emit( type, response );

      }, defaultMap() );
  });
}); 

suite( 'wiki example', function() {
  test( 'check wiki example', function() {

    var source = 'A { B( C ); };'
      , rules = { 'open': '{' };

    //get a single token:
    fluke.splitNext( source, function( type, response ) {
        assert( type == 'open' ); 
        assert( response.lhs == 'A ' );
        assert( response.rhs == ' B( C ); };' );
        assert( response.token == '{' ); 
      }, rules );
    
    //get all tokens: 
    fluke.splitAll( source, function( type, response ) {
        assert( type == 'open' || type == 'end' ); 
        
        if (type == 'open') {
          assert( response.lhs == 'A ' );
          assert( response.rhs == ' B( C ); };'); 
          assert( response.token == '{' );
          assert( response.stash == '' );
        }
        else {
          assert( response.lhs == ' B( C ); };' );
          assert( response.stash == 'A {' );
        }
      }, rules );
  });
}); 

function splitAll( code, rules ) {

  var emitter = new Expector();

  if (typeof rules === 'undefined') {
    rules = defaultMap();
  }
  emitter.on( 'end', function() {
    process.nextTick( emitter.check );
  } ); 

  emitter.run = function() {
    fluke.splitAll( code, emitter.emit.bind( emitter ), rules );
  };
  
  return emitter;
}

function splitNext( code, rules ) {
  var emitter = new Expector();

  if (typeof rules === 'undefined') {
    rules = defaultMap();
  }
  emitter.run = function() {
    fluke.splitNext( code, function(type, response) {
        emitter.emit( type, response );
        process.nextTick( emitter.check ); 
      }
      , rules 
    );
  };
  
  return emitter;
}

function defaultMap() {
  return {
    'statement': ';',
    'open': '{',
    'close': '}',
  };
}

