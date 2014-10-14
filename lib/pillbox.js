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
   * @method
   * @param {Object} pillOptions Options to be passed to the Pill constructor.
   *                             See Pill documentation for more details.
   * @listens Pill#requestRmoval
   * @fires Pillbox#requestPillRemoval
   * @listens Pill#click
   * @fires Pillbox#clickPill
   * @fires Pillbox#addPill
   */
  addPill: function (pillOptions) {
    // silently do nothing if the pill has already been added
    if (this.hasPill(pillOptions.key)) { return; }

    var pill = new Pill(pillOptions);

    this._pills[pillOptions.key] = pill;
    pill.draw(this._el);

    pill.on("request:remove", _.bind(function () {
      /**
       * Event fired (forwarded from Pill) when a pill requests its removal
       * @event Pillbox#requestPillRemoval
       * @property {Object} pill The pill instance that requested removal
       */
      this.emit("pill:request:remove", pill);
    }, this));

    pill.on("click", _.bind(function () {
      /**
       * Event fired (forwarded from Pill) when a pill is clicked
       * @event Pillbox#clickPill
       * @property {Object} pill The pill instance that was clicked
       */
      this.emit("pill:click", pill);
    }, this));

    /**
     * Event fired when a pill is added to the pillbox
     * @event Pillbox#addPill
     * @property {Object} pill The newly added pill
     */
    this.emit("pill:add", { pill: this._pills[pillOptions.key] });
  },

  /**
   * Removes a pill from the pillbox and the DOM.
   * @param  {String} key A pill's key, used to look up the pill
   * @fires Pillbox#removePill
   */
  removePill: function (key) {
    this._pills[key].erase();
    this._pills[key] = null;

    /**
     * Event fired when a pill is removed from the pillbox
     * @event Pillbox#removePill
     * #property {String} key The key that was used to find the removed pill
     */
    this.emit("pill:remove", { key: key });
  },

  /**
   * Checks for the existence of a pill in our pillbox.
   * @param  {String}  key A pill's key, used to look up the pill
   * @return {Boolean}
   */
  hasPill: function (key) {
    return !!this._pills[key];
  }
});

module.exports = Pillbox;
