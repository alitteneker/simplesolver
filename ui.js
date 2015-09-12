
$(document).ready(function() {

  /** This sets up the solve button functionality. */
  $('#solve_btn').on('click', function() {
    var exprs = $('.expression_inp.mathquill-editable'),
        var_names = $('#variable_inp').val().replace(' ', '').split(',');

    var fail = false;
    for( var i = 0; i < exprs.length; ++i ) {
      var parsed = parseExpression( exprs[i].mathquill('text') );
      if( !parsed ) {
        exprs[i].addClass('input_error');
        fail = true;
      }
      else {
        exprs[i].removeClass('input_error');
      }
      exprs[i] = parsed;
    }
    if( fail ) {
      return false;
    }

    var results = solve(exprs, var_names);

    if( results !== undefined ) {
      var output = "";
      for( var key in results ) {
        output += "<tr><td>" + key + "</td><td>" + results[key] + "</td></tr>";
      }
      $('#results_display').empty().append(output);
    }
  });

  /** Functionality for adding new expresisons. */
  function addExpression() {
    var template = $('.template_row'),
        last = $('#last_expr_row');
    if( !template.length || !last.length ) {
      return;
    }
    template = template.clone().removeClass('template_row').insertBefore(last);
    $('.remove_expr_btn', template).on('click', removeExpression);
    $('.expression_inp', template).mathquill('editable');
    if( $('.expression_inp:visible').length > 1 ) {
      $('.remove_expr_btn').removeClass('remove_expr_hide');
    }
  }

  /** Functionality for removing expressions. */
  function removeExpression(e) {
    var target = $(e.target).closest('tr');
    if( target.length ) {
      target.remove();
      if( $('.expression_inp:visible').length <= 1 ) {
        $('.remove_expr_btn').addClass('remove_expr_hide');
      }
    }
  }

  addExpression();
  $('#add_expr_button').click(addExpression);

});
