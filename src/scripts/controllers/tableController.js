/**
 * @module tableController
 */

import {getInsightsData} from 'model';
import * as d3 from 'd3';
import tableChart from 'table';
import Panel from "panel";

var tables = {};

export var tableExport = {
  addTable: addTable,
  setData: setData,
  createDrawingFunc: createDrawingFunc,
  draw: draw,
  addDropdownListener: addDropdownListener
}; 

/***** Public Functions *****/

/**
 * draw a table with head and body inside the location defined by using chartname as a selector
 * @function drawTable
 * @param {String} chartname - css selector for chart
 */
function addTable(chartname) {
  if(!tables.hasOwnProperty(chartname)){
    let p = new Panel();
    tables[chartname] = p;

    // assume that we only draw the table if the tables does not yet have a key for chartname
    // because of how the groupedBar and table are both in panel body, we require that a div be in panel
    // body with class of tableContainer
    let table = d3.select(chartname + ' .tableContainer')
        .append("table")
        .attr("class", "table");

    // table should have a head and body
    table.append("thead");
    table.append("tbody");
  }
}

/**
 * Set the data needed for the table 
 * @function buildData
 * @param {String} chartname - css selector for chart
 * @param {String} txnType
 */
function setData(chartname, txnType) {
  if(!tables.hasOwnProperty(chartname)) {
    let p = new Panel();
    tables[chartname] = p;
  } 

  let insightsData = getInsightsData(txnType); // result is object with keys for each fi and values of arrays of objects
  tables[chartname].data = insightsData;
}

/**
 * Create and store the drawing function for the table
 * @function createDrawingFunc
 * @param {String} chartname - css selector for chart
 */
function createDrawingFunc(chartname) {
  if(!tables.hasOwnProperty(chartname)) {
    let p = new Panel();
    tables[chartname] = p;
  }

  tables[chartname].drawFunc = tableChart();
}

/**
* If it exists, call the drawing function associated with chartname
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
    throw new Error("Attempt to call draw function for non-existent table panel object");
  }
}

/** 
 * @function addDropdownListener
 * @param {String} chartname - css selector for chart
 */
function addDropdownListener(chartname) {
  // don't add listener if chart doesn't exist
  if(tables.hasOwnProperty(chartname)){
    // add listener
    let selector = chartname + " .dropdown-menu li";
    let cb = dropdownCallbackBuilder(chartname);
    //"click.mine" prevents previous event listeners from being overwritten
    d3.selectAll(selector).on('click.mine', cb);
  } else {
    throw new Error("Attempt to add dropdown listener for non-existent table panel object");
  }
}

/***** Private Functions *****/
// this var for exporting functions to be tested only, not intended to be used in code
export var testing = {
  uniqueMccNames: uniqueMccNames,
  buildTableData: buildTableData
};

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

/**
* Return the data structure needed by the table drawing function
* @private
* @function buildTableData
* @param {Object} data - object belonging to transaction type in the model
* @param {string} param - value to extract
* @param {string[]} mccNames - mccNames to use for columns and headers
* @returns {Object[]} array of objects
*/
function buildTableData(chartname, data, mccNames) {
  if(tables.hasOwnProperty(chartname)) {
    let param = tables[chartname].dropdown;
    
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
  } else {
    throw new Error("Attempt to build data for non-existent tables panel object");
  }
}

/**
 * Shape data for passing to draw function
 * @function buildData
 * @param {String} chartname - css selector for chart
 */
function buildData(chartname) {
  // check that chartname exists
  if(tables.hasOwnProperty(chartname)) {
    // make sure dropdown param is set, if param is null, dropdown wasn't set yet
    if(tables[chartname].dropdown === null) {
      setDropdown(chartname); 
    }

    // get raw data
    let insightsData = tables[chartname].data;
    
    // get list of unique mcc_names
    let mccNames = uniqueMccNames(insightsData); 

    // shape and return the data 
    return buildTableData(chartname, insightsData, mccNames);

  } else {
    throw new Error("Attempt to call data property in non-existent tables panel object");
  }
}

/**
 * Set the dropdown param of the associated chart
 * @function setDropdown
 * @param {String} chartname - css selector for chart
 * @param {String} [val] - optional dropdown value
 */
function setDropdown(chartname, val) {
  if(!tables.hasOwnProperty(chartname)) {
    let p = new Panel();
    tables[chartname] = p;
  } 

  // if user did not pass in val, default to first dropdown list element
  if(val === undefined) {
    let selector = chartname + ' .dropdown-menu li';
    val = d3.select(selector).attr('data-value');
  }

  tables[chartname].dropdown = val;
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