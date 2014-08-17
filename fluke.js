
// process next token in source
function splitNext(source, cb, rules) { 
  
  var matches = source.match( makeRegExp( joinProperties( rules ) ) );
  if (matches) {
    for (property in rules) {
      var token = matches[0].match( makeRegExp( rules[property] ) );
      if (token) {
        var response = {
          lhs: token.input.replace( new RegExp( rules[property] ), '' ),
          rhs: source.substr( token.input.length, source.length ),
          token: token[1]
         };
        cb( property, response );
        return;
      }
    }
  }
  cb( 'end', { lhs: source } );
  
  function makeRegExp( rules ) {
    return new RegExp( '.*?(' + rules + ')' );
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
        }
        cb( event, response );
      }, 
      rules );
  } 
  while(!done);
}

exports.splitNext = splitNext;
exports.splitAll = splitAll;
