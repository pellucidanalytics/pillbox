var _ =  require('lodash');
var Pillbox = require('../..');
var tmpl = require('./pill.jade');

var values = ['Fruit', 'Vegetable', 'Grain', 'Dairy'];

var simpleRibbon = new Pillbox({
  container: document.querySelector('.tag-ribbon')
});

_.each(values, function (value) {
  simpleRibbon.addPill({
    value: value,
    name: value.toLowerCase(),
    template: tmpl
  });
});
