
// process next token in source
function splitNext(source, cb, rules) { 
  
  var matches = source.match( makeRegExp( joinProperties( rules ) ) );
  if (matches) {
    for (property in rules) {
      var token = matches[0].match( makeRegExp( rules[property] ) );
      if (token) {
        var lhs = token.input.replace( new RegExp( rules[property] ), '' );
        var rhs = source.substr( token.input.length, source.length );
        cb( property, lhs, rhs, token[1] );
        return;
      }
    }
  }
  cb( 'end', source );
  
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
    splitNext( source, function(event, lhs, rhs, token) {
        if (event == 'end') done = true;
        cb( event, lhs, source = rhs, token );
      }, 
      rules );
  } 
  while(!done);
}

exports.splitNext = splitNext;
exports.splitAll = splitAll;
