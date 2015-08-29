/**
  * Copyright 2015 Alan Litteneker
  *
  * This script defines a set of functions for finding an approximate numerical solution to a generic
  * expression. Given a list of variables over which to solve, it uses a simplified version of newton's
  * method (sometimes referred to as relaxation theory in modern literature) to iteratively approach a
  * system in which the expression is equal to zero, then outputs the found solution.
  *
  * Note that like most local search methods, this is extraordinarily susceptible to local minima.
  */

/** This */
function solve() {
  var expr = $('#equation_inp').val(),
      var_names = $('#variable_inp').replace(' ', '').val().split(','),
      result = do_solve(expr, var_names);

  // TODO: display results in a more meaningful way
  for( var key in result ) {
    console.log( key + ": " + result[key] );
  }
}

/** This actually solves for vaiable assignments, though it too doesn't really  */
function do_solve(expr, var_names) {

  var var_length = var_names.length,

      // The current var values
      vars = initialize_values(var_names, var_length, 0),

      // Cache the current value of the expression
      result = eval_expression(expr, vars, var_names, var_length),

      // Current and previous mean squared error
      mse = calc_mse(result),
      last_mse = Infinity,

      // How low we need our mean squared error to drop before accepting the current values
      thresh_mse_done = 0.01,

      // If our mse doesn't change by at least this much, then we can stop
      thresh_mse_stagnant = 0.0001,

      // Counter for number of repetitions, and upper bound of
      reps = 0,
      max_reps = 10000;

  while(
       mse > thresh_mse_done
    && Math.abs( last_mse - mse ) > thresh_mse_stagnant
    && reps++ < max_reps
  ) {

    result = calc_new_settings(expr, vars, var_names, var_length);

    last_mse = mse;
    mse = calc_mse(result);
  }

  // store the last recorded _mse and _result for display
  vars[_mse] = mse;
  vars[_result] = mse;

  return vars;
}

function calc_new_settings(expr, vars, var_names, var_length) {
  var initial_delta = 1, initial_value, name, delta;

  for( var i = 0; i < var_length; ++i ) {
    name = var_names[i];
    initial_value = vars[name];
    delta = initial_delta;


  }

  return eval_expression(expr, vars, var_names, var_length);
}

function initialize_values(var_names, var_length, initial_value) {
  var vars = {}, i;
  for( i = 0; i < var_length; ++i ) {
    vars[var_names[i]] = initial_value;
  }
  return vars;
}

function calc_mse(result) {
  if( arguments.length > 1 ) {
    result = eval_expression.apply(arguments);
  }
  return Math.pow(result, 2);
}

function eval_expression( expr, vars, var_names, var_length ) {
  for( var i = 0; i < var_length; ++i ) {
    window[var_names[i]] = vars[var_names[i]];
  }
  return eval(expr);
}
