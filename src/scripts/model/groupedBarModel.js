/**
 * Store state for groupedBar charts
 * @module groupedBarModel
 */

/***** local packages *****/
import Panel from 'panelClass';

/***** export *****/

/***** model *****/
/**
 * @private
 * @name tables
 * @dwsc store a panel object for each table in the view 
 */
var charts = {};

/*
// All of these take chartname plus parameters
addGroupedBar
setSvgSize
getSvgSize
setMargins
getMargins
getResetCount
setData
getData
setDropdown
getDropdown

addCheckboxes
getAllCheckboxes
getAllChecked
getCheckboxValue
checkAll
toggleCheckbox
*/

/***** wrap checkbox functions *****/

/**
 * @return {Object} contains all checkbox values and checked status
 */
getAllCheckboxes() {
  return this._cboxes.getAll();
}

/**
 * @return {String[]}
 */
getAllChecked() {
  return this._cboxes.getAllChecked();
}

/**
 * @return {Bool}
 * @param {string} name - name of the checkbox
 */
getCheckboxValue(name) {
  return this._cboxes.getValue(name);
}

/**
 * Check all checkboxes
 * @return {this} for chaining calls
 */
checkAll() {
  this._cboxes.checkAll();
  return this;
}

/**
 * toggle the checked status of a checkbox and update the reset count
 * @returns {String[]}
 */
toggle(chartname, name) {
  // .toggleCheckboxes() returns checked values
  return charts[chartname].toggleCheckbox(name); 
}
