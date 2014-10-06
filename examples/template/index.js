var _ =  require('lodash');
var Pills = require('../..');
var tmpl = require('./tag.jade');

var tags = ['Fruit', 'Vegetable', 'Grain', 'Dairy'];

var simpleRibbon = new Pills.Ribbon({
  container: document.querySelector('.tag-ribbon')
});

_.each(tags, function (tag) {
  simpleRibbon.addTag({
    value: tag,
    name: tag.toLowerCase(),
    template: tmpl
  });
});
