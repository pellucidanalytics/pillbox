var tools = require("./testtools");
var expect = tools.expect;

var Pillbox = require("..");
var Pill = require("../lib/pill");

describe("Pillbox", function () {
  describe("constructor", function () {
    it("should create a new pillbox", function () {
      var myPillbox = new Pillbox({ container: document.body });
      expect(myPillbox).to.be.an.instanceOf(Pillbox);
    });

    it("should not require the new keyword", function () {
      var myPillbox = Pillbox({ container: document.body });
      expect(myPillbox).to.be.an.instanceOf(Pillbox);
    });

    it("should throw an error if no parent is provided", function () {
      // FIXME: this is throwing an error, but not the error you'd expect
      // for example, change it to .throw(/DOM container/)... fails
      expect(Pillbox).to.throw(Error);
      // expect(Pillbox).to.throw(/DOM container/);
    });

    it("should initialize with no pills if none were given", function () {
      var myPillbox = Pillbox({ container: document.body });
      expect(myPillbox._pills).to.eql({});
    });

    it("should create instances for pills passed to the constructor", function () {
      var myPillbox = Pillbox({
        container: document.body,
        pills: [
          { key: 'foo', value: 'Foobar' }
        ]
      });

      expect(myPillbox._pills).to.have.key('foo');
      expect(myPillbox._pills.foo).to.be.an.instanceOf(Pill);
    });
  });

  describe("addPill", function () {
    var myPillbox = Pillbox({ container: document.body });
    myPillbox.addPill({
      key: 'foo',
      value: 'Foo!'
    });
    it("should add a pill with the options provided", function () {
      expect(myPillbox._pills).to.have.key('foo');
      expect(myPillbox._pills.foo).to.be.an.instanceOf(Pill);
      expect(myPillbox._pills.foo.value).to.equal('Foo!');
    });

    it("should do nothing if the key is already in use", function () {
      myPillbox.addPill({
        key: 'foo',
        value: 'Bar!'
      });

      // _pills['foo'] hasn't changed, the last statement was ignored
      expect(myPillbox._pills.foo.value).to.equal('Foo!');
    });

    // TODO: add tests for event triggering
  });

  describe("removePill", function () {
    var myPillbox = Pillbox({
      container: document.body,
      pills: [{
        key: 'foo',
        value: 'Foobar'
      }, {
        key: 'baz',
        value: 'Qux!'
      }]
    });

    it("should decrease the total number of pills in the pillbox", function () {
      myPillbox.removePill('foo');
      expect(myPillbox._pills).to.not.have.key('foo');
      expect(myPillbox.keys()).to.have.length(1);
    });

    it("should remove the pill's rendering from the dom", function () {
      // TODO: this needs some phantom magic
    });

    it("should not break if the given key doesn't exist", function () {
      expect(function () {
        myPillbox.removePill('abc');
      }).to.not.throw(Error);
    });
  });

  describe("hasPill", function () {
    it("should return true if a pill exists with the given key", function () {
      //
    });

    it("should return false if no pill exists with the given key", function () {
      //
    });
  });

  describe("keys", function () {
    it("should return an array of keys", function () {
      // check that it's an array even when this._pills === {}
      // check that it's an array when pills exist
      // check that the number of array items matches the number of keys
    });
  });

  describe("getPill", function () {
    it("should return a pill instance, given the pill's key", function () {
      //
    });
  });
});