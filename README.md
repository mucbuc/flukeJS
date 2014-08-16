flukeJS
=======

convenience functions for tokenizing javascript strings 


objective
=========

provide access to rules after each token gets split


usage
=====

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

