/**
 * expose a class for storing chart state in the appropriate model file
 * @module panelClass
 */

import Checkboxes from 'checkboxes';

export default class Panel {
  /**
   * Create a panel with default values. Will need to use class methods to initialize values.
   */
  constructor() {
    this._cboxes = null;
    this._data = null;
    this._dropdown = null;
    this._resetCount = 0;
    this._svgSize = {
      width: 0,
      height: 0
    }; 
    this._svgMargins = {
      top: 0,
      left: 0,
      right:0,
      bottom: 0 
    } 
  }

  /**
   * @return {Object} checkbox object
   */
  get cboxes() {
    return this._cboxes;
  }

  /**
   * @param {String[]} valArr - values that can be checked or unchecked
   * @param {Bool[]} defaultArr - whether each value in valArr is checked or not
   * @return {this} for chaining calls
   */
  createCboxes(valArr, defaultArr) {
    this._cboxes = new Checkboxes(valArr, defaultArr);
    // keep the reset count up to date
    this._resetCount = Object.keys(this._cboxes.getAll()).length - this._cboxes.getAllChecked().length; 
    return this;
  }

  /**
   * toggle a checkbox value
   * @return {String[]} 
   */
  toggleCheckbox(name) {
    var arr = this._cboxes.toggle(name);
    // keep the reset count up to date
    this._resetCount = Object.keys(this._cboxes.getAll()).length - this._cboxes.getAllChecked().length; 
    return arr;
  }

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

  /**
   * @return {Int} 
   */
  get svgSize() {
    return this._svgSize;
  }

  /**
   * @param {Int} val
   * @return {this} for chaining calls
   */
  set svgSize(val) {
    this._svgSize = val;
    return this;
  }

  /**
   * @return {Object} Margins object with left, right, top, bottom properties
   */
  get svgMargins() {
    return this._svgMargins;
  }

  /**
   * @param {Object} Object with left, right, top and bottom properties
   * @return {this} for chaining calls
   */
  set svgMargins(val) {
    this._svgMargins = val;
    return this;
  }

  /**
   * @return {Int} 
   */
  get resetCount() {
    return this._resetCount;
  }



}
