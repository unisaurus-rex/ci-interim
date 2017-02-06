export default class Panel {
  constructor() {
    this._cboxes = null;
    this._data = null;
    this._dropdown = null;
    this._resetCount = 0;
    this._svg = {
      width: 0,
      height: 0,
      margins: { top: 0, left: 0, right:0, bottom: 0 }
    } 
  }

  //get cboxes() {}
  // set cboxes() {}

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
    return this;
  }

  get dropdown() {
    return this._dropdown;
  }

  set dropdown(val) {
    this._dropdown = val;
    return this;
  }

  /*
    get resetCount() {}
    set resetCount() {}
    get svgWidth() {}
    set svgWidth() {}
    get svgHeight() {}
    set svgHeight() {}
    get svgMargins() {}
    set svgMargins() {}
  */
}
