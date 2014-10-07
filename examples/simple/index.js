var _ =  require('lodash');
var Pillbox = require('../..');

var simpleBox = new Pillbox({
  container: document.getElementById('tag-ribbon')
});

var values = ['Roots', 'Seeds', 'Drupes'];

_.each(values, function (value) {
  simpleBox.addPill({
    name: value.toLowerCase(),
    value: value,
    states: ['pill','inactive'],
    remove: true
  });
});

simpleBox.on('pill:request:remove', function (pill) {
  console.log('The following pill requested removal:', pill.value);
  simpleBox.removeTag(pill.name);
});

simpleBox.on('pill:click', function (pill) {
  if (pill.hasState('active')) {
    pill.removeState('active');
    pill.setState('inactive');
  } else {
    pill.setState('active');
    pill.removeState('inactive')
  }
});
