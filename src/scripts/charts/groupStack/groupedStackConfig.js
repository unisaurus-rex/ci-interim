export default function stackConfig() {
  this.classMap = null;
  this.classMapFunction = null;
  this.width = null;
  this.height = null;
  this.margin = null;

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

  this.setWidth = function (r) {
    if(arguments.length) {
      this.width = r;
    }

    return this;
  };

  this.setHeight = function (n) {
    if(arguments.length) {
      this.Height = n;
    }

    return this;
  };

  this.setMargin = function (t) {
    if(arguments.length) {
      this.margin = t;
    }

    return this;
  };

}
