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
   * @listens Pill#request:remove
   * @fires Pillbox#pill:request:remove
   * @listens Pill#click
   * @fires Pillbox#pill:click
   * @listens Pill#state:add
   * @fires Pillbox#pill:state:add
   * @listens Pill#state:remove
   * @fires Pillbox#pill:state:remove
   * @fires Pillbox#pill:add
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
       * @event Pillbox#pill:request:remove
       * @property {Object} pill The pill instance that requested removal
       */
      this.emit("pill:request:remove", pill);
    }, this));

    pill.on("click", _.bind(function () {
      /**
       * Event fired (forwarded from Pill) when a pill is clicked
       * @event Pillbox#pill:click
       * @property {Object} pill The pill instance that was clicked
       */
      this.emit("pill:click", pill);
    }, this));

    pill.on("state:add", _.bind(function (data) {
      /**
       * Event fired (forwarded from Pill) when a state is added to a pill
       * @event Pillbox#pill:state:add
       * @property {Object} data Data passed to the listener function
       * @property {Object} data.pill The pill that the state was added to
       * @property {String} data.state The state that was added
       */
      this.emit("pill:state:add", {
        pill: pill,
        state: data.state
      });
    }, this));

    pill.on("state:remove", _.bind(function (data) {
      /**
       * Event fired (forwarded from Pill) when a state is removed to a pill
       * @event Pillbox#pill:state:remove
       * @property {Object} data Data passed to the listener function
       * @property {Object} data.pill The pill that the state was removed from
       * @property {String} data.state The state that was removed
       */
      this.emit("pill:state:remove", {
        pill: pill,
        state: data.state
      });
    }, this));

    /**
     * Event fired when a pill is added to the pillbox
     * @event Pillbox#pill:add
     * @property {Object} pill The newly added pill
     */
    this.emit("pill:add", { pill: pill });
  },

  /**
   * Removes a pill from the pillbox and the DOM.
   * @param  {String} key A pill's key, used to look up the pill
   * @fires Pillbox#pill:remove
   */
  removePill: function (key) {
    this._pills[key].erase();
    this._pills[key] = null;

    /**
     * Event fired when a pill is removed from the pillbox
     * @event Pillbox#pill:remove
     * @property {String} key The key that was used to find the removed pill
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
