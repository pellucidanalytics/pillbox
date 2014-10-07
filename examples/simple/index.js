var _ =  require('lodash');
var Pills = require('../..');

var simpleRibbon = new Pills.Ribbon({
  container: document.getElementById('tag-ribbon')
});

var tagNames = ['Roots', 'Seeds', 'Drupes'];

_.each(tagNames, function (tag) {
  simpleRibbon.addTag({
    name: tag.toLowerCase(),
    value: tag,
    states: ['pill','inactive'],
    remove: true
  });
});

simpleRibbon.on('tag:request:remove', function (tag) {
  console.log('The following tag requested removal:', tag.value);
  simpleRibbon.removeTag(tag.name);
});

simpleRibbon.on('tag:click', function (tag) {
  if (tag.hasState('active')) {
    tag.removeState('active');
    tag.setState('inactive');
  } else {
    tag.setState('active');
    tag.removeState('inactive')
  }
});
