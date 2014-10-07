var _ = require('lodash');

function ListFilter(options) {
  this.container = options.container;
  this.items = {};

  this.addItems(options.items);
}

_.extend(ListFilter.prototype, {
  addItem: function (item) {
    // keep a reference to this object
    this.items[item.key] = {
      value: item.value,
      tags: item.tags || []
    };

    // create a dom node
    this.items[item.key].el = document.createElement('li');
    this.items[item.key].el.appendChild(document.createTextNode(item.value));

    // and draw that dom node
    this.container.appendChild(this.items[item.key].el);
  },
  addItems: function (items) {
    _.each(items, function (item) {
      this.addItem(item);
    }, this);
  },
  hideItem: function (key) {
    this.items[key].el.style.display = 'none';
  },
  showItem: function (key) {
    this.items[key].el.style.display = 'block';
  },
  filterByTags: function (tags) {
    _.each(this.items, function (item, key) {
      if (_.isEmpty(_.intersection(item.tags, tags))) {
        // hide the item if none of its tags match the given tags
        this.hideItem(key);
      } else {
        // otherwise, there was a match, so show it
        this.showItem(key);
      }
    }, this);
  }
});

module.exports = ListFilter;
