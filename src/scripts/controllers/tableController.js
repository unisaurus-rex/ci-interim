/**
 * @module tableController
 */

import {getInsightsData} from 'model';
import {exportObj as tableModel} from 'tableModel';
import * as d3 from 'd3';
import tableChart from 'table';
import CtrlState from  'ctrlState';

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

    // set dropdown

    // set draw function

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
