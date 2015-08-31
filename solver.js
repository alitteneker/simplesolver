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

/** This solves the system (sort of, really just error handling for the real workers). */
function solve(expr, var_names) {

  if( !expr.length || !var_names.length ) {
    console.error("Invalid input");
    return;
  }

  var result;
  try {
    result = do_solve(expr, var_names);
  }
  catch(e) {
    console.error(e);
    return;
  }

  return result;
}

/** This actually solves for variable assignments, and returns the results. */
function do_solve(expr, var_names) {

  var var_length = var_names.length,

      // The current var values (initialized to zero)
      vars = initialize_values(var_names, var_length, 0),

      // The last deltas (initialized to 1)
      // TODO: initialize to something smarter
      deltas = initialize_values(var_names, var_length, 1),

      // Cache the current value of the expression
      result = eval_expression(expr, vars, var_names, var_length),

      // Current and previous mean squared error
      mse = calc_mse(result),
      last_mse = Infinity,

      // How low we need our mean squared error to drop before accepting the current values
      thresh_mse_done = 0.0001,

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

    result = calc_new_settings(expr, vars, deltas, var_names, var_length);

    last_mse = mse;
    mse = calc_mse(result);
  }

  // store some metadata for display
  vars['_mse'] = mse;
  vars['_result'] = result;
  vars['_reps'] = reps;

  return vars;
}

function calc_new_settings(expr, vars, deltas, var_names, var_length) {
  var min_delta = 0.0001,

      old_mse = calc_mse(expr, vars, var_names, var_length),

      // Some working variables
      test_mse, name, old_delta, old_sign, initial_delta;

  for( var i = 0; i < var_length; ++i ) {
    name = var_names[i];

    old_delta = deltas[name];
    old_sign = Math.sign(old_delta);

    // initialize our delta to be double the old delta or our min_delta
    initial_delta = deltas[name] =
        2 * old_sign * Math.max( Math.abs(old_delta), min_delta );

    while( true ) {
      test_mse = calc_mse(expr, vars, var_names, var_length, deltas, name);

      if( test_mse < old_mse ) {
        break;
      }
      else if( Math.abs(deltas[name]) < min_delta ) {
        if( old_sign === Math.sign(deltas[name]) ) {
          deltas[name] = -initial_delta;
        }
        else {
          deltas[name] = 0;
          break;
        }
      }
      else {
        deltas[name] /= 2;
      }
    }
  }

  for( var i = 0; i < var_length; ++i ) {
    vars[name] += deltas[name];
  }
  return eval_expression(expr, vars, var_names, var_length);
}

function eval_expression( expr, vars, var_names, var_length, deltas, active_delta) {
  for( var i = 0; i < var_length; ++i ) {
    window[var_names[i]] = vars[var_names[i]] + ( active_delta == var_names[i] ? deltas[var_names[i]] : 0 );
  }
  return eval(expr);
}

function initialize_values(var_names, var_length, initial_value) {
  var data = {}, i;
  for( i = 0; i < var_length; ++i ) {
    data[var_names[i]] = initial_value;
  }
  return data;
}

function calc_mse(result) {
  if( arguments.length > 1 ) {
    result = eval_expression.apply(undefined, arguments);
  }
  return Math.pow(result, 2);
}
