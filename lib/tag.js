var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

function Tag(options) {
  if (!(this instanceof Tag)) { return new Tag(options); }
  EventEmitter.call(this);

  this._states = [];
  this._el = document.createElement("div");
  this._el.appendChild(document.createTextNode(options.value));
}

inherits(Tag, EventEmitter);

_.extend(Tag.prototype, {
  draw: function (parent) {
    parent.appendChild(this._el);
  },
  erase: function () {
    this._el.parentNode.removeChild(this._el);
  },
  setState: function (state) {
    if (this.hasState(state)) { return; }

    this._states.push(state);
    this.el.className += ' ' + state;
    this.emit("state:added", {state: state});
  },
  removeState: function () {
    if (!this.hasState(state)) { return; }

    _.remove(this._states, function (item) {
      return item === state;
    });

    // TODO: make sure this doesn't cause a flicker
    this.el.className = this._states.join(' ');
  },
  hasState: function (state) {
    return _.indexOf(this._states, state) > -1;
  }
});
