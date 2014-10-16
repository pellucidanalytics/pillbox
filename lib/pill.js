var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

/**
 * Create individual pills and manage their states. Instead of using this
 * constructor directly, you will probably use Pillbox#addPill instead.
 *
 * @constructor
 * @augments EventEmitter2
 * @param {Object} options Options used to construct a Pill
 * @param {String} key A string used to identify a pill
 * @param {String} value A string that will represent this pill in the DOM
 * @param {Boolean} [remove] Determines if a pill should have a close button
 *                           if no template is given.
 * @param {Pill~templateFunction} [template] A function used to create a template
 * @param {String[]} [states] Array of strings to be used as initial states
 */
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

  this._el.onclick = _.bind(function () {
    /**
     * Emit a click event when the pill's DOM element has been clicked
     * @event Pill#click
     */
    this.emit("click");
  }, this);
}

inherits(Pill, EventEmitter);

_.extend(Pill.prototype, /** @lends Pill.prototype */ {
  /**
   * Create a new DOM element to represent this pill (using a template if one)
   * is available.
   * @private
   * @param  {Pill~templateFunction} [template] Create an HTML template
   * @param  {Boolean}          [remove]   Create a button to allow a pill
   *                                       to request its removal
   * @return {HTMLElement}                 The new HTML element representing
   *                                       our pill in the DOM
   */
  _createElement: function (template, remove) {
    var container = document.createElement("div");

    if (_.isFunction(template)) {
      // extract first DOM node from template, if a template exists
      /**
       * The template function is any function that takes an object and returns
       * a string of HTML. Jade and Handlebars template functions have both been
       * tested, and most other template languages should work as well.
       *
       * @callback Pill~templateFunction
       * @param {Object} data       An object of data passed to the template
       * @param {String} data.value The template function is called with an
       *                            object that has a single value property.
       *                            This value is the value that was passed to
       *                            this pill's constructor.
       * @return {String}           The template function must return a string
       *                            of HTML which will be inserted into the DOM.
       */
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

  /**
   * Create a representation of this pill in the DOM.
   * @param  {HTMLElement} parent Element to which the pill should be appended
   */
  draw: function (parent) {
    parent.appendChild(this._el);
  },

  /**
   * Remove a pill from the DOM.
   */
  erase: function () {
    this._el.parentNode.removeChild(this._el);
  },

  /**
   * A pill can request to have itself removed from containing ribbons.
   * To do so, it emits an event. It's up to user code to respond to
   * this event and tell the deck to actually carry out the removal.
   *
   * @fires Pill#request:remove
   */
  requestRemoval: function () {
    /**
     * Fire an event when a pill requests its removal.
     * @event Pill#request:remove
     */
    this.emit("request:remove");
  },

  /**
   * Add a new state to the pill if it hasn't already been added. This stores
   * the state in an array and adds the state as a class to the DOM node.
   *
   * @param {String} state A new state to be added to the pill
   * @fires Pill#state:add
   */
  setState: function (state) {
    if (this.hasState(state)) { return; }

    this._states.push(state);
    this._el.className += ' ' + state;

    /**
     * Fire an event when a pill has been given a new state
     * @event Pill#state:add
     */
    this.emit("state:add", {state: state});
  },

  /**
   * Remove a state from the pill, which also removes the state from the pill
   * element's list of classes.
   *
   * @param  {String} state The state to be removed from the pill
   */
  removeState: function (state) {
    if (!this.hasState(state)) { return; }

    _.remove(this._states, function (item) {
      return item === state;
    });

    this._el.className = _.filter(this._el.className.split(" "), function (name) {
      return name !== state;
    }).join(" ");
  },

  /**
   * Remove all states from a pill.
   */
  cleanState: function () {
    _.each(this._states, function (state) {
      this.removeState(state);
    }, this);
  },

  /**
   * Determine whether a pill currently has a state.
   * @param  {String}  state The state to search for
   * @return {Boolean}
   */
  hasState: function (state) {
    return _.indexOf(this._states, state) > -1;
  }
});

module.exports = Pill;
