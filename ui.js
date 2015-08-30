
/** This sets up the solve button functionality. */
$('#solve_btn').on('click', function() {
  var expr = $('.expression_inp').val(),
      var_names = $('#variable_inp').val().replace(' ', '').split(','),
      results = solve(expr, var_names);

  if( results !== undefined ) {
    var output = "";
    for( var key in results ) {
      output += "<tr><td>" + key + "</td><td>" + results[key] + "</td></tr>";
    }
    $('#results_display').empty().append(output);
  }
});
