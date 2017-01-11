export default donutConfig() {
  this.classMap = null;
  this.valueFunction = null;
  this.constancyFunction = null;
  this.classMapFunction = null;
  this.innerRad = null;
  this.innerNumber = null;
  this.innerText = null;
  this.padAngle = null;

  this.setClassMap = (m) => {
    if(arguments.length) {
      this.classMap = m;
    }

    return this;
  };

  this.setValueFunction= (f) => {
    if(arguments.length) {
      this.valueFunction = f;
    }

    return this;
  };

  this.setConstacyFunction = (f) => {
    if(arguments.length) {
      this.constancyFunction = f;
    }

    return this;
  };

  this.setClassMapFunction = (f) => {
    if(arguments.length) {
      this.classMapFunction = f;
    }

    return this;
  };

  this.setInnerRad = (r) => {
    if(arguments.length) {
      this.innerRad = r;
    }

    return this;
  };

  this.setInnerNumber = (n) => {
    if(arguments.length) {
      this.innerNumber = n;
    }

    return this;
  };

  this.setInnerText = (t) => {
    if(arguments.length) {
      this.innerText = t;
    }

    return this;
  };

  this.setPadAngle = (p) => {
    if(arguments.length) {
      this.padAngle = p;
    }

    return this;
  };

}
