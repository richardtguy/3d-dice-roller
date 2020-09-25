"use strict";

async function dice_initialize(container) {

  var canvas = $t.id('canvas');
  /*
  DEBUG: Combinations of different dice types (standard and custom) cause
  problems.  E.g. "2d6?hq+d8" uses custom face labels for both d6 and d8,
  although I didn't add this to create_d8 yet! Something to do with reusing
  previously created faces?
  */
  var set = "d6?red";

  $t.dice.use_true_random = false;
  $t.dice.dice_color = '#808080';
  $t.dice.label_color = '#202020';
  $t.dice.add_custom_face_labels(
    'd6',
    'hq',
    [
      ' ',
      '0',
      '',
      'https://d8313b97-ada4-44ff-b3d5-a04cecf1b685.s3.eu-west-2.amazonaws.com/red.png',
      'https://d8313b97-ada4-44ff-b3d5-a04cecf1b685.s3.eu-west-2.amazonaws.com/blue.png',
      'https://d8313b97-ada4-44ff-b3d5-a04cecf1b685.s3.eu-west-2.amazonaws.com/white.png',
      'https://d8313b97-ada4-44ff-b3d5-a04cecf1b685.s3.eu-west-2.amazonaws.com/green.png',
      'https://d8313b97-ada4-44ff-b3d5-a04cecf1b685.s3.eu-west-2.amazonaws.com/black.png',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20'
    ]);

  // TODO: add more than one set of custom face labels

  var box = new $t.dice.dice_box(canvas, { w: 500, h: 500 });

  $t.bind(window, 'resize', function() {
    let rect = document.documentElement.getBoundingClientRect();
    console.log(rect)
    canvas.style.width = rect.width - 1 + 'px';
    canvas.style.height = rect.height - 1 + 'px';
    box.reinit(canvas, { w: 500, h: 500 });
  });

  function before_roll(vectors, notation, callback) {
    // workaround to ensure canvas size is calculated after all content is loaded
    let rect = document.documentElement.getBoundingClientRect();
    canvas.style.width = rect.width - 1 + 'px';
    canvas.style.height = rect.height - 1 + 'px';
    box.reinit(canvas, { w: 500, h: 500 });
    // pass result array to callback to load the dice (or no arguments for random)
    callback();
    // TODO: work out how to specify predetermined result for custom face labels
    // (specify array index? or add a "name" field and adjust to use this)
  }

  function notation_getter() {
    // get set of dice
    return $t.dice.parse_notation(set);
  }

  function after_roll(notation, result) {
  }

  // controls
  box.bind_mouse(container, notation_getter, before_roll, after_roll);
  $t.bind(window, 'keydown', function(e) {
      if (e.code == "Escape") {
          box.clear();
      }
  });

}

// demonstrate that click events do not target the overlay...
window.addEventListener("click", function(e) {
  console.log(e);
})
