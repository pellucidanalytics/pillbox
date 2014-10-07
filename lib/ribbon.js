var _ = require("lodash");
var EventEmitter = require("eventemitter2").EventEmitter2;
var inherits = require("inherits");

var Tag = require("./tag");

function Ribbon(options) {
  if (!(this instanceof Ribbon)) { return new Ribbon(options); }
  EventEmitter.call(this);

  this.el = options.container;
  this._tags = {};
}

inherits(Ribbon, EventEmitter);

_.extend(Ribbon.prototype, {
  addTag: function (tagOptions) {
    // silently do nothing if the tag has already been added
    if (this.hasTag(tagOptions.name)) { return; }

    var tag = new Tag(tagOptions);

    this._tags[tagOptions.name] = tag;
    tag.draw(this.el);

    // notify user when a tag has requested removal
    tag.on("request:remove", _.bind(function () {
      this.emit("tag:request:remove", tag);
    }, this));

    // notify user when tag has been clicked
    tag.on("click", _.bind(function () {
        this.emit("tag:click", tag);
    }, this));

    this.emit("tag:added", { tag: this._tags[tagOptions.name] });
  },

  removeTag: function (tagName) {
    this._tags[tagName].erase();
    this._tags[tagName] = null;
    this.emit("tag:removed", { tagName: tagName });
  },

  hasTag: function (tagName) {
    return !!this._tags[tagName];
  }

  // eachTag: function (cb) {
  //   _.each(this._tags, cb);
  // }
});

module.exports = Ribbon;
