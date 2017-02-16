/**
 * Store state for groupStacked charts
 * @module groupStackedModel
 */

/***** local packages *****/
import {Panel} from 'panelClass';
import {InvalidChartError, DuplicateChartError} from 'errorObjects';
/***** export *****/

export var exportObj = {
  addgroupStacked, addgroupStacked,
  addCheckboxes: addCheckboxes,
  getAllCheckboxes: getAllCheckboxes,
  getAllChecked: getAllChecked,
  getCheckboxValue: getCheckboxValue,
  checkAll: checkAll,
  toggle: toggle, 
  setSvgSize: setSvgSize,
  getSvgSize: getSvgSize,
  setMargins: setMargins,
  getMargins: getMargins,
  getResetCount: getResetCount,
  setData: setData,
  getData: getData,
  setDropdown: setDropdown,
  getDropdown: getDropdown
};

/***** model *****/
/**
 * @private
 * @name groupStacked
 * @desc store a panel object for each groupStacked in the view 
 * each panel is accessed by a key, 'chartname', which is a css selector for a chart
 */
var charts = {};

/**
 * create a new Panel object in charts if charts does not contain the matching chartname
 * @function addgroupStacked
 * @param {String} chartname
 */
function addGroupStacked(chartname) {
  // add a new chart to charts if the name doesn't already exist
  if(!charts.hasOwnProperty(chartname)) {
    charts[chartname] = new Panel();
  } else {
    throw new DuplicateChartError(chartname); 
  }
}

/**
 * @function setSvgSize
 * @param {String} chartname
 * @param {Object} obj - needs to have width and height property
 */
function setSvgSize(chartname, obj) {
  if(charts.hasOwnProperty(chartname)) {
    charts[chartname].svgSize = obj;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function getSvgSize
 * @param {String} chartname
 * @return {Object} contains width and height property
 */
function getSvgSize(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].svgSize;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function setMargins
 * @param {String} chartname
 * @param {Object} margins - object with left, right, top, bottom properties
 */
function setMargins(chartname, margins) {
  if(charts.hasOwnProperty(chartname)) {
    charts[chartname].svgMargins = margins;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function getMargins
 * @param {String} chartname
 * @return {Object} contains left, right, top, bottom properties
 */
function getMargins(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].svgMargins;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function getResetCount
 * @param {String} chartname
 * @return {Int}
 */
function getResetCount(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].resetCount;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function setData
 * @param {String} chartname
 * @param {Object} data
 */
function setData(chartname, data) {
  if(charts.hasOwnProperty(chartname)) {
    charts[chartname].data = data;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function getData
 * @param {String} chartname
 * @return {Object} 
 */
function getData(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].data;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function setDropdown
 * @param {String} chartname
 * @param {String} val 
 */
function setDropdown(chartname, val) {
  if(charts.hasOwnProperty(chartname)) {
    charts[chartname].dropdown = val;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

/**
 * @function getDropdown
 * @param {String} chartname
 * @return {String}
 */
function getDropdown(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    return charts[chartname].dropdown;
  } else {
    throw new InvalidChartError(chartname); 
  }
}

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
    throw new InvalidChartError(chartname);
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
    throw new InvalidChartError(chartname);
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
    throw new InvalidChartError(chartname); 
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
    throw new InvalidChartError(chartname); 
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
    throw new InvalidChartError(chartname); 
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
    throw new InvalidChartError(chartname); 
  }
}