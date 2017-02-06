/**
 *@module tableModel 
 *@description hold state related to each table chart
 */

/***** local packages *****/
import Panel from 'panelClass';

/***** export *****/
export var tableModel = {
  addTable: addTable,
  setData: setData,
  getData: getData,
  setDropdown: setDropdown,
  getDropdown: getDropdown
};

/***** model *****/
var tables = {}; 

/**
 *
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
 *
 */
function setData(chartname, data) {
  if(tables.hasOwnProperty(chartname)){
    tables[chartname].data(data);
  } else {
    throw new Error("call to setData: " + chartname + " does not exist");
  }
}

/**
 *
 */
function getData(chartname, data) {
  if(tables.hasOwnProperty(chartname)){
    return tables[chartname].data; 
  }
}

/**
 *
 */
function setDropdown(chartname, val) {
  if(tables.hasOwnProperty(chartname)){
    tables[chartname].dropdown(val);
  } else {
    throw new Error("call to setDropdown: " + chartname + " does not exist");
  }
}

/**
 *
 */
function getDropdown(chartname, dropdown) {
  if(tables.hasOwnProperty(chartname)){
    return tables[chartname].dropdown;
  }
}
