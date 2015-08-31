
$(document).ready(function() {

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

  function addExpression() {
    var template = $('.template_row'),
        last = $('#last_expr_row');

    if( !template.length || !last.length ) {
      return;
    }

    template = template.clone().removeClass('template_row').insertBefore(last);
    $('.remove_expr_btn', template).on('click', removeExpression);

    if( $('.expression_inp:visible').length > 1 ) {
      $('.remove_expr_btn').show();
    }
  }

  function removeExpression(e) {
    var target = $(e.target).closest('tr');

    if( target.length ) {
      target.remove();

      if( $('.expression_inp:visible').length <= 1 ) {
        $('.remove_expr_btn').hide();
      }
    }
  }

  addExpression();
  $('#add_expr_button').click(addExpression);

});
