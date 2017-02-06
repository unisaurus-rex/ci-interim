/**
 * expose a class for storing chart state in the appropriate model file
 * @module panelClass
 */
export default class Panel {
  /**
   * Create a panel with default values. Will need to use class methods to initialize values.
   */
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

  /**
   * @return {Object} base data associated with the Panel
   */
  get data() {
    return this._data;
  }

  /**
   * Set the base data associated with the Panel instance 
   * @param {Object} data - base data 
   * @return {Object} this instance for chaining
   */
  set data(data) {
    this._data = data;
    return this;
  }

  /**
   * @return {String} current value of the dropdown associated with the Panel instance
   */
  get dropdown() {
    return this._dropdown;
  }

  /**
   * Set the dropdown value for the panel instance
   * @param {String} val
   */
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
