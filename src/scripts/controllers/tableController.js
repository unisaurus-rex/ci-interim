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
    addDropdownListener(chartname);

    // draw table
    draw(chartname);
  }
}

/***** Private Functions *****/

// this var for exporting functions to be tested only, not intended to be used in code
export var testing = {
  uniqueMccNames: uniqueMccNames,
  buildTableData: buildTableData
};

/** 
 * @function addDropdownListener
 * @param {String} chartname - css selector for chart
 */
function addDropdownListener(chartname) {
  // build listener target 
  let selector = chartname + " .dropdown-menu li a";

  // build callback function
  let cb = dropdownCallbackBuilder(chartname);

  // add listener
  //"click.mine" prevents previous event listeners from being overwritten
  d3.selectAll(selector).on('click.mine', cb);
}

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
 * Shape data for passing to draw function
 * @private
 * @function buildData
 * @param {String} chartname - css selector for chart
 * @return {Object[]} array of objects in proper format for passing to draw function
 */
function buildData(chartname) {
  // get raw data
  let insightsData = tableModel.getData(chartname);;

  // get dropdown param
  let param = tableModel.getDropdown(chartname);
  
  // get list of unique mcc_names
  let mccNames = uniqueMccNames(insightsData); 

  // shape and return the data 
  return buildTableData(chartname, insightsData, param, mccNames);
}

/**
 * Return the data structure needed by the table drawing function
 * @private
 * @function buildTableData
 * @param {Object} data - object belonging to transaction type in the model
 * @param {string} param - value to extract
 * @param {string[]} mccNames - mccNames to use for columns and headers
 * @returns {Object[]} array of objects
 */
function buildTableData(chartname, data, param, mccNames) {
  // need to build one object per fi
  var fiNames = Object.keys(data);
  // each object should have key/values = mcc_name: param
  // each object also needs an fi key
  var tableData = fiNames.map( (fi) => {
    // value of each fi key is an array of objects
    // table is expecting array of objects, one object per row
    // reduce array of objects to one object
    let rowObj = data[fi].reduce( (res, obj) => {
      // extract the requested param from the object
      let key = obj.mcc_name; 
      res[key] = obj[param];
      return res;
    }, {});

    // add an fi key
    rowObj["fi"] = fi;

    return rowObj;
      
  });

  tableData.columns = ["fi", ...mccNames];
  tableData.headers = ["FI", ...mccNames];

  return tableData;
}

/**
 * If it exists, call the drawing function associated with chartname
 * @private
 * @function draw
 * @param {String} chartname - css selector for chart
 */
function draw(chartname) {
  // make sure chartname exists before drawing
  if(tables.hasOwnProperty(chartname)) {
    // drawing function takes a d3 selection
    let selector = chartname + " .tableContainer";
    let selection = d3.select(selector);
    let data = buildData(chartname); 

    tables[chartname].drawFunc(selection, data);
  } else {
    throw new Error(`Attempt to call draw function for non-existent tables object. ${chartname} does not exist in tables`);
  }
}

/**
 * @function dropdownCallbackBuilder
 * @param {String} chartname - css selector for chart
 */
function dropdownCallbackBuilder(chartname) {
  return function(d) {
    // get selected dropdown value
    let val = d3.select(this).attr('data-value');

    // set dropdown value
    setDropdown(chartname, val);
    
    // draw table
    draw(chartname);
  }
}

/**
 * Get the first item in chartname's dropdown list
 * @private
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
 * @private
 * @param {Object} err - Error object with message property
 */
function handleError(err) {
  console.log(err.message);
}

/**
 * Set the data needed for the table 
 * @function buildData
 * @private
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
 * @private
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
 * @private
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

/**
 * Find the unique mcc_name properties
 * @private
 * @function uniqueMccNames
 * @param {Object} data - object belonging to transaction type in the model
 * @returns {string[]}
 */
function uniqueMccNames(data) {
  // for each fi, get all mcc_names, result is array of arrays
  var fiNames = Object.keys(data);
  var mccArrays = fiNames.map( (fi) => {
    var arr = data[fi];
    return arr.map( (obj) => {
      return obj.mcc_name; 
    });
  });

  // join arrays to form single array
  var allMccNames = mccArrays.reduce( (res, current) => {
    return res.concat(current);
  }, []);

  // remove repeated values 
  return Array.from(new Set(allMccNames)); 
}
