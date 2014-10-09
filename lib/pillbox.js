var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

var Pill = require("./pill");

function Pillbox(options) {
  if (!(this instanceof Pillbox)) { return new Pillbox(options); }
  EventEmitter.call(this);

  this.el = options.container;

  this.collapsedHeight = options.collapsedHeight;
  this.expandedHeight = options.expandedHeight;
  this.isExpanded = false;

  if (this.collapsedHeight) {
    this._addExpandButton();
  }

  this.animate = options.animate || function (el, props) {
    _.each(props, function (val, key) {
      el.style[key] = val + "px";
    });
  };

  this._pills = {};
}

inherits(Pillbox, EventEmitter);

_.extend(Pillbox.prototype, {
  _addExpandButton: function () {
    var btn = document.createElement("button");
    btn.appendChild(document.createTextNode("\u25BC"));
    btn.className = "pillbox-expand";
    btn.onclick = _.bind(this.toggleHeight, this);
    this.el.appendChild(btn);
  },

  addPill: function (pillOptions) {
    // silently do nothing if the pill has already been added
    if (this.hasPill(pillOptions.name)) { return; }

    var pill = new Pill(pillOptions);

    this._pills[pillOptions.name] = pill;
    pill.draw(this.el);

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
