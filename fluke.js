
// process next token in source
function splitNext(source, cb, rules) { 
  
  var matchPos = source.search( makeRegExp( joinProperties( rules ) ) );
  if (matchPos != -1) {
    var match = source.substr( 0, matchPos + 1 )
    for (property in rules) {
      var rule = rules[property]
        , re = makeRegExp( rule );
      if (source.search(re) == matchPos) {
        var token = source.match( makeRegExp( rule ) )
          , response = {
              lhs: source.substr( 0, matchPos ), 
              rhs: source.substr( matchPos + token[0].length ),
              token: token[0]
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
