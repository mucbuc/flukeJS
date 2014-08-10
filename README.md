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
    fluke.splitNext( source, function( type, lhs, source ) {
        assert( type == 'open' ); 
        assert( lhs.trim() == 'A' );
        assert( source.trim() == 'B( C ); };' ); 
      }, rules );
  
    //get all tokens: 
    fluke.splitAll( source, function( type, lhs, source ) {
        assert( type == 'open' || type == 'end' ); 

        if (type == 'open') {
          assert( lhs.trim() == 'A' );
          assert( source.trim() == 'B( C ); };'); 
        }
        else {
          assert( source.trim() == 'B( C ); };' );
        }
      }, rules ); 

