var _ =  require('lodash');
var Pillbox = require('../..');
var ListFilter = require('./listfilter');

var tmpl = require('./pill.jade');
var data = _.map(require('./data').foods, function (item) {
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
    key: value.toLowerCase(),
    value: value,
    template: tmpl
  });
});

var foodList = new ListFilter({
  container: document.querySelector('.food-item-list'),
  items: data
});

var activeTags = [];

myPills.on('pill:click', function (data) {
  if (data.pill.hasState('active')) {
    data.pill.removeState('active');
    _.remove(activeTags, function (tag) {
      return tag === data.pill.value;
    });
  } else {
    data.pill.setState('active');
    activeTags.push(data.pill.value);
  }

  foodList.filterByTags(activeTags);
});
