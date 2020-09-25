"use strict";

function load_image(uri) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    // Note server must be set up to allow cross-origin requests
    img.crossOrigin = '*';
    img.src = uri;
  })
}

function load_face_label_images(face_labels) {
  const images = face_labels.map((label) => {
    try {
      new URL(label);
    } catch (e) {
      return label;
    }
    return load_image(label);
  })
  return Promise.all(images)
}


async function dice_initialize(container) {

  var canvas = $t.id('canvas');
  // TODO: extend notation to choose custom dice e.g. 2D6?heroquest, and search
  // for this name for the custom label set
  var set = "2d6";

  $t.dice.use_true_random = false;
  $t.dice.dice_color = '#808080';
  $t.dice.label_color = '#202020';
  $t.dice.custom_d20_dice_face_labels = await load_face_label_images([
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

  // TODO: hide this image loading stuff in a function in dice e.g. "load_custom_face_labels"
  // - the user shouldn't worry about this.

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
