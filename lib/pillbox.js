var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

var Pill = require("./pill");

function Pillbox(options) {
  if (!(this instanceof Pillbox)) { return new Pillbox(options); }
  EventEmitter.call(this);

  this._el = options.container;
  this._pills = {};
}

inherits(Pillbox, EventEmitter);

_.extend(Pillbox.prototype, {
  addPill: function (pillOptions) {
    // silently do nothing if the pill has already been added
    if (this.hasPill(pillOptions.name)) { return; }

    var pill = new Pill(pillOptions);

    this._pills[pillOptions.name] = pill;
    pill.draw(this._el);

    // notify user when a pill has requested removal
    pill.on("request:remove", _.bind(function () {
      this.emit("pill:request:remove", pill);
    }, this));

    // notify user when pill has been clicked
    pill.on("click", _.bind(function () {
      this.emit("pill:click", pill);
    }, this));

    this.emit("pill:add", { pill: this._pills[pillOptions.name] });
  },

  removePill: function (pillName) {
    this._pills[pillName].erase();
    this._pills[pillName] = null;
    this.emit("pill:remove", { pillName: pillName });
  },

  hasPill: function (pillName) {
    return !!this._pills[pillName];
  }
});

module.exports = Pillbox;
