var _ =  require('lodash');
var Pillbox = require('../..');
var ListFilter = require('./listfilter');

var tmpl = require('./pill.jade');
var data = require('./data').foods.map(function (item) {
  return {
    key: item.name.toLowerCase(),
    value: item.name,
    tags: item.tags
  }
});
var tags = _.uniq(_.flatten(_.pluck(data, 'tags')));

var myPills = new Pillbox({
  container: document.querySelector('.pill-tag-list')
});

_.each(tags, function (value) {
  myPills.addPill({
    value: value,
    name: value.toLowerCase(),
    template: tmpl
  });
});

var foodList = new ListFilter({
  container: document.querySelector('.food-item-list'),
  items: data
});

var activeTags = [];

myPills.on('pill:click', function (pill) {
  if (pill.hasState('active')) {
    pill.removeState('active');
    _.remove(activeTags, function (tag) {
      return tag === pill.value;
    });
  } else {
    pill.setState('active');
    activeTags.push(pill.value);
  }

  foodList.filterByTags(activeTags);
});
