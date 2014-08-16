
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
  var done = false;
  do {
    splitNext( source, function(event, response) {
        if (event == 'end') done = true;
        else {
          source = response.rhs;
          response.consume = function(length) {
            source = source.substr( length, source.length );
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
