/**
 * expose a class for storing chart state in the appropriate model file
 * @module panelClass
 */

import Checkboxes from 'checkboxes';
import {ValidationError} from 'errorObjects';

export class Panel {
  /**
   * Create a panel with default values. Will need to use class methods to initialize values.
   */
  constructor() {
    this._cboxes = null;
    this._data = null;
    this._dropdown = null;
    this._dropdownChanged = false;
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

  /***** Wrap checkbox functionality *****/

  /**
   * @param {String[]} valArr - values that can be checked or unchecked
   * @param {Bool[]} defaultArr - whether each value in valArr is checked or not
   * @return {this} for chaining calls
   */
  createCboxes(valArr, defaultArr) {
    this._cboxes = new Checkboxes(valArr, defaultArr);
    // keep the reset count up to date
    _updateResetCount.call(this);
    return this;
  }

  /**
   * @return {Object} 
   */
  getAllCheckboxes() {
    return this._cboxes.getAll();
  }

  /**
   * @return {String[]} all properties that are checked
   */
  getAllChecked() {
    return this._cboxes.getAllChecked();
  }

  /**
   * @return {Bool}
   */
  getCheckboxValue(name) {
    return this._cboxes.getValue(name);
  }

  /**
   * check all checkboxes
   */
  checkAll() {
    this._cboxes.checkAll();
    _updateResetCount.call(this);
  }

  /**
   * toggle a checkbox value
   * @return {String[]} 
   */
  toggleCheckbox(name) {
    var arr = this._cboxes.toggle(name);
    // keep the reset count up to date
    _updateResetCount.call(this);
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
   * @return {Boolean} current value of dropdownChanged
   */
  get dropdownChanged() {
    return this._dropdownChanged;
  }

 /**
   * Set dropdownChanged to val
   * @param {Boolean} val
   */
  set dropdownChanged(val) {
    this._dropdownChanged = val;
  }

  /**
   * @return {Object} contains width and height properties
   */
  get svgSize() {
    return this._svgSize;
  }

  /**
   * @param {Object} with width and height properties 
   * @return {this} for chaining calls
   */
  set svgSize(val) {
    // confirm val has correct structure before setting, throw validation error if it doesn't
    if(_validateSvgSize(val)) {
      this._svgSize = val;
    } else {
      throw new ValidationError('svgSize');
    }

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
    if(_validateSvgMargins(val)) {
      this._svgMargins = val;
    } else {
      throw new ValidationError('svgMargins');
    }

    return this;
  }

  /**
   * @return {Int} 
   */
  get resetCount() {
    return this._resetCount;
  }



}


/***** Private Functions *****/

// export private functions for testing only
export var testing = {
  validateSvgSize: _validateSvgSize,
  validateSvgMargins: _validateSvgMargins
};

/**
 * Private function to be invoked by the panel class.  Panel class instance needs to pass its context to _updateResetCount
 * by invoking _updateResetCount with .call(this)
 * @private
 * @function _updateResetCount
 */
function _updateResetCount() {
  this._resetCount = Object.keys(this._cboxes.getAll()).length - this._cboxes.getAllChecked().length;
}

/**
 * @private
 * @function _validateSvgSize
 * @param {Object} val - contains width and height property
 * @desc return false if val is not an object or is missing the width or height property, true otherwise
 */
function _validateSvgSize(val) {
  var keys = ['width', 'height']; // properties that val should contain

  //confirm val is an object
  if(typeof val != 'object') {
    return false;
  }
  
  // confirm val contains all properties in keys
  return keys.every((prop) => {return val.hasOwnProperty(prop);});
}

/**
 * @private
 * @function _validateSvgMargins
 * @param {Object} val - contains left, right, top and bottom properties 
 * @desc return falseif val is not an object or is missing needed properties, true otherwise
 */
function _validateSvgMargins(val) {
  var keys = ['top', 'bottom', 'left', 'right']; // properties that val should contain

  //confirm val is an object
  if(typeof val != 'object') {
    return false;
  }
  
  // confirm val contains all properties in keys
  return keys.every((prop) => {return val.hasOwnProperty(prop);});
}
