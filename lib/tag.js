var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

function Tag(options) {
  if (!(this instanceof Tag)) { return new Tag(options); }
  EventEmitter.call(this);

  this.name = options.name;
  this.value = options.value;
  this._states = [];
  this._el = this._createElement(options.template, options.remove);

  // iterate over any states that were passed in and add them
  _.each(options.states, function (state) {
    this.setState(state);
  }, this);
}

inherits(Tag, EventEmitter);

_.extend(Tag.prototype, {
  _createElement: function (template, remove) {
    var container = document.createElement("div");

    if (_.isFunction(template)) {
      // extract first DOM node from template, if a template exists
      container.innerHTML = template({ value: this.value });
      return container.firstChild;
    }

    // if no template was given, create a simple element
    container.appendChild(document.createTextNode(this.value));

    // and append a remove button if specified by the options
    if (remove) {
      var btn = document.createElement("button");
      btn.appendChild(document.createTextNode("\u00D7"));
      btn.onclick = _.bind(this.requestRemoval, this);
      container.appendChild(btn);
    }

    return container;
  },
  draw: function (parent) {
    parent.appendChild(this._el);
  },
  erase: function () {
    this._el.parentNode.removeChild(this._el);
  },

  /**
   * A tag can request to have itself removed from containing ribbons.
   * To do so, it emits an event. It's up to user code to respond to
   * this event and tell the deck to actually carry out the removal.
   * @return {undefined}
   */
  requestRemoval: function () {
    this.emit("request:remove");
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
    this.el.className = this._states.join(" ");
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
