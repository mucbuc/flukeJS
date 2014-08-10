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

