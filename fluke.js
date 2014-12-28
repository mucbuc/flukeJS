
// process next token in source
function splitNext(source, cb, rules) { 
  
  var matchPos = source.search( makeRegExp( joinProperties( rules ) ) );
  if (matchPos != -1) {
    var match = source.substr( 0, matchPos )
    for (property in rules) {
      var tokenLen = rules[property].length
        , token = source.substr( matchPos, tokenLen );
      if (token == rules[property])
      {
        var response = {
          lhs: source.substr( 0, matchPos ), 
          rhs: source.substr( matchPos + tokenLen ),
          token: token
        };
        cb( property, response );
        return;
      }
    }
  }
  cb( 'end', { lhs: source } );
  
  function makeRegExp( rules ) {
    return new RegExp( '(' + rules + ')' ); 
  }

  function joinProperties(properties) {
    var result = [];
    for(property in properties) {
      result.push( properties[property] );
    }
    return result.join( '|' );
  }
}

// process all tokens in tokens
function splitAll(source, cb, rules) {
  var done = false
    , stash = '';
  do {
    splitNext( source, function(event, response) {
        response.stash = stash;
        if (event == 'end') done = true;
        else {
          
          source = response.rhs;
          stash += response.lhs + response.token;

          response.consume = function(length) {
            stash += source.substr( 0, length );
            source = source.substr( length, source.length );
          };

          response.resetStash = function() {
            stash = '';
          };
          
          response.break = function() {
            done = true; 
          };
        }
        cb( event, response );
      }, 
      rules );
  } 
  while(!done);
}

exports.splitNext = splitNext;
exports.splitAll = splitAll;
