var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

function Pill(options) {
  if (!(this instanceof Pill)) { return new Pill(options); }
  EventEmitter.call(this);

  this.key = options.key;
  this.value = options.value;
  this._states = [];
  this._el = this._createElement(options.template, options.remove);

  // iterate over any states that were passed in and add them
  _.each(options.states, function (state) {
    this.setState(state);
  }, this);

  // add a handler to keep track of the selected button
  this._el.onclick = _.bind(function () {
    this.emit("click");
  }, this);
}

inherits(Pill, EventEmitter);

_.extend(Pill.prototype, {
  _createElement: function (template, remove) {
    var container = document.createElement("div");

    if (_.isFunction(template)) {
      // extract first DOM node from template, if a template exists
      container.innerHTML = template({ value: this.value });

      // find a data-remove attribute to be used for removal.
      // defaulting to an empty object is lazier than checking
      // to see close is `null` before setting onclick
      var close = container.querySelector('[data-remove]') || {};

      close.onclick = _.bind(this.requestRemoval, this);
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
   * A pill can request to have itself removed from containing ribbons.
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
    this.emit("state:add", {state: state});
  },
  removeState: function (state) {
    if (!this.hasState(state)) { return; }

    _.remove(this._states, function (item) {
      return item === state;
    });

    this._el.className = _.filter(this._el.className.split(" "), function (name) {
      return name !== state;
    }).join(" ");
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

module.exports = Pill;
