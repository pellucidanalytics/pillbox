var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

function Tag(options) {
  if (!(this instanceof Tag)) { return new Tag(options); }
  EventEmitter.call(this);

  this.value = options.value;
  this._states = [];
  this._el = this._createElement(options.template);

  // iterate over any states that were passed in and add them
  _.each(options.states, function (state) {
    this.setState(state);
  }, this);
}

inherits(Tag, EventEmitter);

_.extend(Tag.prototype, {
  _createElement: function (template) {
    var container = document.createElement('div');

    if (_.isFunction(template)) {
      // extract first DOM node from template, if a template exists
      container.innerHTML = template({ value: this.value });
      return container.firstChild;
    }

    // if no template was given, create a simple element
    container.appendChild(document.createTextNode(this.value));
    return container;
  },
  draw: function (parent) {
    parent.appendChild(this._el);
  },
  erase: function () {
    this._el.parentNode.removeChild(this._el);
  },
  setState: function (state) {
    if (this.hasState(state)) { return; }

    this._states.push(state);
    this._el.className += ' ' + state;
    this.emit("state:added", {state: state});
  },
  removeState: function (state) {
    if (!this.hasState(state)) { return; }

    _.remove(this._states, function (item) {
      return item === state;
    });

    // TODO: make sure this doesn't cause a flicker
    this.el.className = this._states.join(' ');
  },
  cleanState: function () {
    _.each(this._states, function (state) {
      this.removeState(state);
    }, this);
  },
  hasState: function (state) {
    return _.indexOf(this._states, state) > -1;
  }
});

module.exports = Tag;
