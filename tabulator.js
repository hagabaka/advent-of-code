define([], function() {
  function Tabulator() {
    this.counts = {};
  }
  Tabulator.prototype.set = function(name, count) {
    this.counts[name] = count;
  };
  Tabulator.prototype.get = function(name) {
    return this.counts[name];
  };
  Tabulator.prototype.increment = function(name) {
    if(this.counts[name]) {
      this.counts[name]++;
    } else {
      this.counts[name] = 1;
    }
  };
  Tabulator.prototype.names = function() {
    return Object.keys(this.counts);
  };
  return Tabulator;
});
