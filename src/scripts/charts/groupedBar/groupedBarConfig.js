export default function groupedBarConfig() {
  this.classMap = null;
  this.classMapFunction = null;
  this.x0 = null;
  this.x1 = null;
  this.y = null;
  this.groupRangeFunction = null;

  this.setClassMap = function (m) {
    if(arguments.length) {
      this.classMap = m;
    }

    return this;
  };

  this.setClassMapFunction = function (f) {
    if(arguments.length) {
      this.classMapFunction = f;
    }

    return this;
  };

  this.setX0 = function (r) {
    if(arguments.length) {
      this.x0 = r;
    }

    return this;
  };

  this.setX1 = function (n) {
    if(arguments.length) {
      this.x1 = n;
    }

    return this;
  };

  this.setY = function (t) {
    if(arguments.length) {
      this.y = t;
    }

    return this;
  };

  this.setGroupRangeFunction = function (p) {
    if(arguments.length) {
      this.groupRangeFunction = p;
    }

    return this;
  };

}
