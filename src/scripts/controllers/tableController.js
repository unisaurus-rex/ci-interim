/**
 * @module tableController
 */

import {exportObj as tableModel} from 'tableModel';
import {getInsightsData} from 'model';
import * as d3 from 'd3';
import tableChart from 'table';
import CtrlState from  'ctrlState';
import {InvalidTableError} from 'errorObjects';

var tables = {};

export var tableExport = {
  addTable: addTable,
  tables: tables
}; 

/***** Public Functions *****/

/**
 * draw a table with head and body inside the location defined by using chartname as a selector
 * @function drawTable
 * @param {String} chartname - css selector for chart
 * @param {String} txnType - transaction type to filter table data by
 */
function addTable(chartname, txnType) {
  // do nothing if table already exists
  if(!tables.hasOwnProperty(chartname)){

    // init controller state
    let c = new CtrlState();
    tables[chartname] = c;

    // init model state
    tableModel.addTable(chartname);


    // add table html 
    // because of how the groupedBar and table are both in panel body, we require that a div be in panel
    // body with class of tableContainer
    buildContainer(chartname);

    // set table data
    setData(chartname, txnType);

    // set dropdown
    setDropdown(chartname);

    // set draw function
    setDrawFunc(chartname);

    // add dropdown listener

    // draw table
  }
}

/***** Private Functions *****/

/**
* Add the table html structure(table, header and body) inside the table container for chartname 
* @private
* @function buildContainer
* @param {String} chartname
*/
function buildContainer(chartname) {
let table = d3.select(chartname + ' .tableContainer')
.append("table")
.attr("class", "table");


// table should have a head and body
table.append("thead");
table.append("tbody");
}

/**
* Get the first item in chartname's dropdown list
                * @function getDropdownDefault
                * @param {String} chartname
                * @return {String} value of the first dropdown item
                */
                function getDropdownDefault(chartname) {
                  let selector = chartname + ' .dropdown-menu li a';
                  let val = d3.select(selector).attr('data-value');

                  return val;
                } 

                /**
                 * @function handleError
                 * @param {Object} err - Error object with message property
                 */
                function handleError(err) {
                  console.log(err.message);
                }

                /**
                 * Set the data needed for the table 
                 * @function buildData
                 * @param {String} chartname - css selector for chart
                 * @param {String} txnType
                 */
                function setData(chartname, txnType) {

                  let insightsData = getInsightsData(txnType); // result is object with keys for each fi and values of arrays of objects

                  try {
                    tableModel.setData(chartname, insightsData);
                  }
                  catch (e) {
                    handleError(e.message);
                  }
                }

                /**
                 * @function setDrawFunc
                 * @param {String} chartname
                 */
                function setDrawFunc(chartname) {
                  if(tables.hasOwnProperty(chartname)) {
                    tables[chartname].drawFunc = tableChart();
                  } else {
                    throw new InvalidTableError(chartname);
                  }
                }

                /**
                 * Set the dropdown param of the associated chart
                 * @function setDropdown
                 * @param {String} chartname - css selector for chart
                 * @param {String} [val] - optional dropdown value
                 */
                function setDropdown(chartname, val) {

                  // if user did not pass in val, default to first dropdown list element
                  if(val === undefined) {
                    val = getDropdownDefault(chartname);
                  }

                  try {
                    tableModel.setDropdown(chartname, val);
                  }
                  catch (e) {
                    handleError(e);
                  }
                }


