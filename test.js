#!/usr/bin/env node

var assert = require( 'assert' )
  , TestEmitter = require( 'mucbuc-jsthree' ).Test.Emitter
  , fluke = require( './fluke' );

assert( typeof fluke !== 'undefined' );

process.setMaxListeners( 0 ); 

test( testSplitNext );
test( testSplitAll );
test( testSplitEmptySource );
test( testSplitNoRule );
test( testSplitNoRuleEmptySource ); 
test( testWikiExample );

function testWikiExample() {
  var source = 'A { B( C ); };'
      , rules = { 'open': '{' };

  //get a single token:
  fluke.splitNext( source, function( type, lhs, rhs, token ) {
      assert( type == 'open' ); 
      assert( lhs == 'A ' );
      assert( rhs == ' B( C ); };' );
      assert( token == '{' ); 
    }, rules );
  
  //get all tokens: 
  fluke.splitAll( source, function( type, lhs, rhs, token ) {
      assert( type == 'open' || type == 'end' ); 
      
      if (type == 'open') {
        assert( lhs == 'A ' );
        assert( rhs == ' B( C ); };'); 
        assert( token == '{' );
      }
      else {
        assert( rhs == ' B( C ); };' );
      }
    }, rules ); 
}

function testSplitNoRuleEmptySource( emitter ) {
  emitter.expect( 'end', '' ); 
  fluke.splitNext( '', emitter.emit.bind( emitter ), [] );
  
  emitter.expect( 'end', '' ); 
  fluke.splitAll( '', emitter.emit.bind( emitter ), [] );
}

function testSplitNoRule( emitter ) {
  emitter.expect( 'end', '', '{' ); 
  fluke.splitNext( '{', emitter.emit.bind( emitter ), [] );
  
  emitter.expect( 'end', '', '{' ); 
  fluke.splitAll( '{', emitter.emit.bind( emitter ), [] );
}

function testSplitEmptySource( emitter ) {
  emitter.expect( 'end', '' ); 
  splitNext( '', emitter ); 
  
  emitter.expect( 'end', '' ); 
  splitAll( '', emitter ); 
}

function testSplitAll( emitter ) {
  emitter.expect( 'open' );
  emitter.expect( 'statement' );
  splitAll( '{;', emitter );
}

function testSplitNext( emitter ) {
  emitter.expect( 'statement' );
  splitNext( ';', emitter );
}

function splitAll( code, emitter ) {
  fluke.splitAll( code, emitter.emit.bind( emitter ), defaultMap() );
}

function splitNext( code, emitter ) {
  fluke.splitNext( code, emitter.emit.bind( emitter ), defaultMap() );
}

function defaultMap() {
  return {
    'statement': ';',
    'open': '{',
    'close': '}',
  };
}

function test( f ) {
  process.on( 'exit', function() {
    console.log( f.name + ' passed' );
  } );

  f( new TestEmitter() );
}

