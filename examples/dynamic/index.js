var _ =  require('lodash');
var Pillbox = require('../..');

var tmpl = require('./pill.jade');
var container = document.querySelector('.tag-ribbon > ul');
var toggler = document.querySelector('.pillbox-toggle');

var box = new Pillbox({
  container: container
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

var containerIsExpanded = false;

toggler.onclick = function () {
  if (containerIsExpanded) {
    // if container is expanded, collapse
    container.classList.remove('is-expanded');
    container.classList.add('is-collapsed');
    toggler.querySelector('.fa').classList.remove('fa-rotate-180');
    containerIsExpanded = false;
  } else if (container.scrollHeight > container.offsetHeight) {
    // otherwise, if container is overflowed, expand
    container.classList.remove('is-collapsed');
    container.classList.add('is-expanded');
    toggler.querySelector('.fa').classList.add('fa-rotate-180');
    containerIsExpanded = true;
  }
};

function checkButtonState() {
  if (containerIsExpanded || container.scrollHeight > container.offsetHeight) {
    toggler.classList.remove('disabled');
  } else {
    toggler.classList.add('disabled');
  }
}

box.on('pill:add', function () { checkButtonState(); });
box.on('pill:remove', function () { checkButtonState(); });

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
