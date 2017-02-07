/**
 * Store state for groupedBar charts
 * @module groupedBarModel
 */

/***** local packages *****/
import Panel from 'panelClass';
import {GroupedChartError} from 'errorObjects';
/***** export *****/
export var exportObj = {
  addCheckboxes: addCheckboxes,
  getAllCheckboxes: getAllCheckboxes,
  getAllChecked: getAllChecked,
  getCheckboxValue: getCheckboxValue,
  checkAll: checkAll,
  toggle: toggle
};

/***** model *****/
/**
 * @private
 * @name tables
 * @desc store a panel object for each table in the view 
 * each panel is accessed by a key, 'chartname', which is a css selector for a chart
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
*/


/**
 * @function addCheckboxes
 * @paranm {String} chartname
 * @param {String[]} valArr - values that can be checked or unchecked
 * @param {Bool[]} defaultArr - whether each value in valArr is checked or not
 */
function addCheckboxes(chartname, valArr, defaultArr) {
  if(charts.hasOwnProperty(chartname)) {
    charts[chartname].createCboxes(valArr, defaultArr);
  } else {
    throw new GroupedChartError(chartname);
  }
}

/**
 * @function getAllCheckboxes
* @param {String} chartname
* @return {Object} contains all checkbox values and checked status
*/
function getAllCheckboxes(chartname) {
if(charts.hasOwnProperty(chartname)) {
return charts[chartname].getAllCheckboxes();
} else {
  throw new GroupedChartError(chartname);
}
}

/**
 * @function getAllChecked
 * @param {String} chartname
 * @return {String[]} string names of each checked checkbox
 */
function getAllChecked(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].getAllChecked();
  } else {
    throw new GroupedChartError(chartname); 
  }
}

/**
 * @function getCheckboxValue
 * @param {String} chartname
 * @param {String} name - checkbox name
 * @return {Bool}
 */
function getCheckboxValue(chartname, name) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].getCheckboxValue(name);
  } else {
    throw new GroupedChartError(chartname); 
  }
}

/**
 * Check all checkboxes
 * @function checkAll
 * @param {String} chartname
 */
function checkAll(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    charts[chartname].checkAll();
  } else {
    throw new GroupedChartError(chartname); 
  }
}

/**
 * @function toggle
 * @param {String} chartname
 * @param {String} name
 * @returns {String[]} string names of all checked checkboxes
 * toggle the checked status of a checkbox 
 */
function toggle(chartname, name) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].toggleCheckbox(name);
  } else {
    throw new GroupedChartError(chartname); 
  }
}
