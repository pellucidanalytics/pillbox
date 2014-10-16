var _ =  require('lodash');
var Pillbox = require('../..');

var tmpl = require('./pill.jade');
var container = document.querySelector('.tag-ribbon > ul');
var toggler = document.querySelector('.pillbox-toggle');

var box = new Pillbox({
  container: container
});

// polyfill for classlist in old IE
require('./classlist');

document.getElementById('tag-adder').onkeydown = function (e) {
  // smooth over the way IE is weird about events
  e = e || window.event;
  var target = e.target || e.srcElement;

  // when enter key is pressed, add a new pill
  if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
    box.addPill({
      key: target.value,
      value: target.value,
      template: tmpl
    });

    // and clear the input
    target.value = "";
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
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

box.on('pill:request:remove', function (data) {
  box.removePill(data.pill.key);
});

box.on('pill:click', function (data) {
  if (data.pill.hasState('active')) {
    data.pill.removeState('active');
    data.pill.setState('inactive');
  } else {
    data.pill.setState('active');
    data.pill.removeState('inactive')
  }
});
