var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");
var Pill = require("./pill");

/**
 * Top-level constructor for creating pills. Add or remove pills, and handle
 * pill-related events.
 *
 * @constructor
 * @augments EventEmitter2
 * @param {Object} options Options used to construct a Pillbox
 * @param {HTMLElement} options.container A parent element to add pills to
 * @param {Object[]} [options.pills] Options from which pills will be created
 */
function Pillbox(options) {
  if (!(this instanceof Pillbox)) { return new Pillbox(options); }
  EventEmitter.call(this);

  this._el = options.container;
  this._pills = {};

  // add any pills that were initially passed into the constructor
  _.each(options.pills, function (pillOptions) {
    this.addPill(pillOptions);
  }, this);
}

inherits(Pillbox, EventEmitter);

_.extend(Pillbox.prototype, /** @lends Pillbox.prototype */ {
  /**
   * Add a new pill to the pillbox's collection
   * @param {Object} pillOptions Options to be passed to the Pill constructor.
   *                             See Pill documentation for more details.
   */
  addPill: function (pillOptions) {
    // silently do nothing if the pill has already been added
    if (this.hasPill(pillOptions.key)) { return; }

    var pill = new Pill(pillOptions);

    this._pills[pillOptions.key] = pill;
    pill.draw(this._el);

    // notify user when a pill has requested removal
    pill.on("request:remove", _.bind(function () {
      this.emit("pill:request:remove", pill);
    }, this));

    // notify user when pill has been clicked
    pill.on("click", _.bind(function () {
      this.emit("pill:click", pill);
    }, this));

    this.emit("pill:add", { pill: this._pills[pillOptions.key] });
  },

  removePill: function (key) {
    this._pills[key].erase();
    this._pills[key] = null;
    this.emit("pill:remove", { key: key });
  },

  hasPill: function (key) {
    return !!this._pills[key];
  }
});

module.exports = Pillbox;
