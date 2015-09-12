var grammar = false, semantics = false;
var constants = { pi: Math.PI, e: Math.E };

$(document).on('ready', function() {
  grammar = ohm.grammarFromScriptElement();
  semantics = grammar.semantics();

  semantics.addOperation( 'interpret',
    {
      Exp:           function(e)       { return e.interpret(); },
      AddExp:        function(e)       { return e.interpret(); },
      AddExp_plus:   function(x, _, y) { return x.interpret() + y.interpret(); },
      AddExp_minus:  function(x, _, y) { return x.interpret() - y.interpret(); },
      MulExp:        function(e)       { return e.interpret(); },
      MulExp_times:  function(x, _, y) { return x.interpret() * y.interpret(); },
      MulExp_divide: function(x, _, y) { return x.interpret() / y.interpret(); },
      ExpExp:        function(e)       { return e.interpret(); },
      ExpExp_power:  function(x, _, y) { return Math.pow( x.interpret(), y.interpret() ); },
      PriExp:        function(e)       { return e.interpret(); },
      PriExp_paren:  function(_, e, _) { return e.interpret(); },
      PriExp_pos:    function(_, e)    { return e.interpret(); },
      PriExp_neg:    function(_, e)    { return -e.interpret(); },
      ident: function(_, _) {
        // Look up the value of a named constant, e.g., 'pi'.
        return constants[this.interval.contents] || 0;
      },
      number: function(_) {
        // Use `parseFloat` to convert (e.g.) the string '123' to the number 123.
        return parseFloat(this.interval.contents);
      }
    }
  );
});

function parseExpression(expr) {
  if( !grammar || !semantics ) {
    throw Error("Grammar not yet loaded.");
  }

  var ret = grammar.match(expr);
  if( ret.failed() ) {
    return false;
  }
  return semantics(ret);
}

function interpretExpression(expr) {
  if( expr.failed() ) {
    throw Error("Cannot evaluate unmatched expression.");
  }
  return semantics(expr).interpret();
}
