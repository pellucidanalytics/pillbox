var _ =  require('lodash');
var Pills = require('../..');

var simpleRibbon = new Pills.Ribbon({
  container: document.getElementById('tag-ribbon')
});

var tags = [{
  name: 'root-vegetables',
  value: 'Roots',
  states: ['tag-enabled']
}, {
  name: 'seeds',
  value: 'Seeds',
  states: ['tag-enabled']
}, {
  name: 'drupe-fruits',
  value: 'Drupes',
  states: ['tag-enabled']
}];

_.each(tags, function (tag) {
  simpleRibbon.addTag(_.extend(tag, { remove: true }));
});

simpleRibbon.on('tag:request:remove', function (tag) {
  console.log('The following tag requested removal:', tag.value);
  simpleRibbon.removeTag(tag.name);
});

simpleRibbon.on('tag:click', function (tag) {
  if (tag.hasState('selected')) {
    tag.removeState('selected');
  } else {
    tag.setState('selected');
  }
});
