var _ =  require('lodash');
var Pillbox = require('../..');

var tmpl = require('./pill.jade');

var box = new Pillbox({
  container: document.getElementById('tag-ribbon'),
  collapsedHeight: 58,
  expandedHeight: 120
});

document.getElementById('tag-adder').onkeyup = function (e) {
  if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
    // add a new pill
    box.addPill({
      name: e.target.value,
      value: e.target.value,
      template: tmpl
    });

    // and clear the input
    e.target.value = "";
  }
};

box.on('pill:request:remove', function (pill) {
  box.removePill(pill.name);
});

box.on('pill:click', function (pill) {
  if (pill.hasState('active')) {
    pill.removeState('active');
    pill.setState('inactive');
  } else {
    pill.setState('active');
    pill.removeState('inactive')
  }
});
