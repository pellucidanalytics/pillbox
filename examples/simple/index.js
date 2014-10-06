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
  simpleRibbon.addTag(tag);
});
