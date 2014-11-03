var _ =  require('lodash');
var Pillbox = require('../..');

var simpleBox = new Pillbox({
  container: document.getElementById('tag-ribbon')
});

var values = ['Roots', 'Seeds', 'Drupes'];

_.each(values, function (value) {
  simpleBox.addPill({
    key: value.toLowerCase(),
    value: value,
    states: ['pill','inactive'],
    remove: true
  });
});

simpleBox.on('pill:request:remove', function (data) {
  console.log('The following pill requested removal:', data.pill.value);
  simpleBox.removePill(data.pill.key);
});

simpleBox.on('pill:click', function (data) {
  if (data.pill.hasState('active')) {
    data.pill.removeState('active');
    data.pill.setState('inactive');
  } else {
    data.pill.setState('active');
    data.pill.removeState('inactive');
  }
});

simpleBox.on('pill:state:add', function (data) {
  console.log(data.pill.value, 'had the following state added:', data.state);
});

simpleBox.on('pill:state:remove', function (data) {
  console.log(data.pill.value, 'had the following state removed:', data.state);
});
