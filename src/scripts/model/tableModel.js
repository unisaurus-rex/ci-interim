/**
 *@module tableModel 
 *@description hold state related to each table chart
 */

/***** local packages *****/
import {Panel} from 'panelClass';

/***** export *****/
export var tableModel = {
  addTable: addTable,
  setData: setData,
  getData: getData,
  setDropdown: setDropdown,
  getDropdown: getDropdown
};

/***** model *****/
/**
 * @private
 * @name tables
 * @dwsc store a panel object for each table in the view 
 */
var tables = {}; 

/**
 * @function addTable
 * @param {String} chartname - name to store the chart as, the chartname should also be a css selector for the chart container
 */
function addTable(chartname) {
  if(!tables.hasOwnProperty(chartname)) {
    let p = new Panel();
    tables[chartname] = p;
  } else {
    throw new Error(" call to addTable: " + chartname + " already exists");
  }
}

/***** Getters and Setters *****/

/**
 * @function setData
 * @param chartname {String} chartname - specific chart to set data on
 * @param {Object} data - base data to use for populating the chart
 */
function setData(chartname, data) {
  if(tables.hasOwnProperty(chartname)){
    tables[chartname].data(data);
  } else {
    throw new Error("call to setData: " + chartname + " does not exist");
  }
}

/**
 * @function getData
 * @param {String} chartname - chart to get data for
 * @return {Object} base data needed by table
 */
function getData(chartname) {
  if(tables.hasOwnProperty(chartname)){
    return tables[chartname].data; 
  }
}

/**
 * Store the current value of the dropdown associated with the table in the html view
 * @function setDropdown 
 * @param {String} chartname - specific chart to set dropdown value for
 * @param {String} val - dropdown value
 */
function setDropdown(chartname, val) {
  if(tables.hasOwnProperty(chartname)){
    tables[chartname].dropdown(val);
  } else {
    throw new Error("call to setDropdown: " + chartname + " does not exist");
  }
}

/**
 * Get the current value of the dropdown associated with the table in the html view
 * @function getDropdown
 * @param {String} chartname - specific chart to get dropdown value for
 * @return {String}
 */
function getDropdown(chartname) {
  if(tables.hasOwnProperty(chartname)){
    return tables[chartname].dropdown;
  }
}
