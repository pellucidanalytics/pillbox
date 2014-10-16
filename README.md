# Pillbox.js

Pillbox.js is a UI container for your (optionally pill-styled) tag labels. The pillbox contains pills (tags), and each pill is aware of its state. Events are emitted whenever something interesting happens.

## Usage

### Installation

Pillbox.js is available as a CommonJS module. Soon, it will be available via npm, like so:

```
npm install --save pillbox
```

And you can require it in your project:

```javascript
var Pillbox  = require('pillbox');
```

### Contstruction

The `Pillbox` variable above is a constructor that takes an object with the following properties:

 - `container` -- The parent DOM element that will contain each "pill"
 - `pills` -- An optional array containing the initial collection of pills

Pills are created with the following options:

 - `key` -- String, used to identify the pill, must be unique
 - `value` -- String that will be displayed on the rendered pill
 - `remove` -- Optional boolean, determines if pills should have close buttons when no template is present.
 - `template` -- An optional function, should return a string of HTML given an object parameter with a `value` property.
 - `states` -- An optional array of strings to be used as initial states

```javascript
var pb = new Pillbox({
  container: document.querySelector('.pill-container'),
  pills: [{/* see pill options above */}]
});
```

### Pillbox Methods

#### addPill( options )

You don't have to add pills initially, though. You can easily add them after creating `pb`.

```javascript
pb.addPill({
    key: 'roots',
    value: 'Root Vegetables',
    template: require('tag.jade'),
    states: ['disabled']
});
```

#### removePill( key )

You can also remove a pill if you know its `key`:

```javascript
pb.removePill('roots');
```

#### getPill( key )

You can retrieve an instance of a pill if you know its key. This allows you to check or set a pill's state.

```javascript
pb.getPill('roots').removeState('disabled');
```

#### keys()

You can also request an array of all keys, which would allow you to iterate over each pill and remove it or modify its state:

```javascript
var pillKeys = pb.keys();
_.each(pillKeys, function (key) {
  pb.removePill(key);
});
```

### Pill Methods

#### Managing State

Each pill has an array of states. States translate to classes in the DOM, and they can be modified and queried with the following methods.

- `setState(state)` -- Adds a new state based on the given string
- `removeState(state)` -- Removes an existing state
- `hasState(state)` -- returns `true` or `false` depending on the existence of a given state
- `cleanState()` -- removes all states from the pill

#### Interacting with the DOM

- `draw(parent)` -- Appends an element representing the pill into the given parent
- `erase()` -- Removes the pill's element from the DOM

### Events

Pills emit several events:

- `"click"` -- When a pill is clicked
- `"state:add"` -- When a state is added to a pill
- `"state:remove"` -- When a state is removed from a pill
- `"request:remove"` -- When a pill requests to be removed (e.g. when the `x` is clicked)

However, getting pill instances is a hassle, so all pill events are also forwarded through Pillbox with a `"pill:"` prefix. Instead of listening for `"request:remove"` on each pill instance:

```javascript
_.each(pb.keys(), function (key) {
  pb.getPill(key).on('request:remove', function () {
    pb.removePill(key);
  });
});
```

You can instead listen for the event on `pb` directly, which is more concise:

```javascript
pb.on('pill:request:remove', function (pill) {
  pb.removePill(pill.key);
});
```

In addition to forwarding Pill events, Pillbox emits two events of its own:

- `"pill:add"` -- Emitted after a new pill is added. The pill object is passed to the callback.
- `"pill:remove"` -- Emitted after a pill is removed. The pill's key is passed to the callback.

## Development

With `npm` and `gulp` installed globally, you can run a development build (which includes file watching) by running the following in the project directory:

```
npm install
gulp
```
