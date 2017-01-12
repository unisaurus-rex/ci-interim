export default function donutConfig() {
  this.classMap = null;
  this.valueFunction = null;
  this.constancyFunction = null;
  this.classMapFunction = null;
  this.innerRad = null;
  this.innerNumber = null;
  this.innerText = null;
  this.padAngle = null;

  this.setClassMap = function (m) {
    if(arguments.length) {
      this.classMap = m;
    }

    return this;
  };

  this.setValueFunction= function (f) {
    if(arguments.length) {
      this.valueFunction = f;
    }

    return this;
  };

  this.setConstancyFunction = function (f) {
    if(arguments.length) {
      this.constancyFunction = f;
    }

    return this;
  };

  this.setClassMapFunction = function (f) {
    if(arguments.length) {
      this.classMapFunction = f;
    }

    return this;
  };

  this.setInnerRad = function (r) {
    if(arguments.length) {
      this.innerRad = r;
    }

    return this;
  };

  this.setInnerNumber = function (n) {
    if(arguments.length) {
      this.innerNumber = n;
    }

    return this;
  };

  this.setInnerText = function (t) {
    if(arguments.length) {
      this.innerText = t;
    }

    return this;
  };

  this.setPadAngle = function (p) {
    if(arguments.length) {
      this.padAngle = p;
    }

    return this;
  };

}
