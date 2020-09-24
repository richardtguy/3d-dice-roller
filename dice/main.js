"use strict";

function dice_initialize(container) {

  var canvas = $t.id('canvas');
  var set = "4d6";

  $t.dice.use_true_random = false;
  $t.dice.dice_color = '#808080';
  $t.dice.label_color = '#202020';

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
    //box.clear();
    // pass result array to callback to load the dice (or no arguments for random)
    callback();
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
