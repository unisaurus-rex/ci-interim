import {getInsightsData} from 'model';
import {exportObj as groupedModel} from 'groupedBarModel' ;
import CtrlState from 'ctrlState';
import * as d3 from "d3";
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import groupedBarChart from 'groupedBar';
import {toolTips} from 'tooltips';


var charts = {};

//used to create a global 
var get = {};

export var groupedExport = {
  addGraph: addGraph,
  charts: charts
}

/***** Public Functions *****/

/**
 * @function addGraph
 * @param {String} chartname
 * @param {Object} svgSize - Size of svg container. Object with width and height properties
 * @param {Object} svgMargins - Margin widths of svg container. Object with top, left, bottom and right properties
 * @param {String} txnType - transaction type of data 
 * @param {Object} config - grouped bar config object
 */
function addGraph(chartname, svgSize, svgMargins, txnType, config) {
  // do nothing if table already exists
  if(!charts.hasOwnProperty(chartname)) {
    /*** Init State ***/
  
    // init controller state
    let c = new CtrlState();
    charts[chartname] = c;

    // init model state
    groupedModel.addGroupedBar(chartname);

    // set svg and margin size
    setContainerBoundaries(chartname, svgSize, svgMargins, txnType);

    // set groupedBar data
    setData(chartname, txnType);

    // set dropdown
    setDropdown(chartname);

    // set checkboxes 

    // set draw function
    setDrawFunc(chartname, config);

    /*** Actions (setup container, add listeners, draw graph) ***/

    // add dropdown listener

    // add checkbox listners

    // draw
  }

}

/***** Private Functions *****/
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
 * set the svgSize and svgMargins in the model 
 * @private
 * @function setContainerBoundaries
 * @param {String} chartname - css selector for chart
 * @param {Object} svgSize - Size of svg container. Object with width and height properties
 * @param {Object} svgMargins - Margin widths of svg container. Object with top, left, bottom and right properties
 */
function setContainerBoundaries(chartname, svgSize, svgMargins) {
  try {
    groupedModel.setSvgSize(chartname, svgSize);
    groupedModel.setMargins(chartname, svgMargins);
  }
  catch(e) {
    handleError(e);
  }

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
    groupedModel.setData(chartname, insightsData);
  }
  catch (e) {
    handleError(e.message);
  }
}

/**
 * Create a drawing function and store it in the charts
 * @private
 * @function setDrawFunc
 * @param {String} chartname - css selector for chart
 * @param {Object} config - groupedBarConfig object
 */
function setDrawFunc(chartname, config) {
  // need svgSize and svgMargins for configuring the drawing function
  let svgSize, svgMargins;

  try {
    svgSize = groupedModel.getSvgSize(chartname);
    svgMargins = groupedModel.getMargins(chartname);
  }
  catch(e) {
    handleError(e);
  }

  let drawFunc = groupedBarChart() 
      .width( svgSize.width - svgMargins.left - svgMargins.right)
      .height(svgSize.height - svgMargins.top - svgMargins.bottom)
      .classMap(config.classMap)
      .classMapFunction(config.classMapFunction)
      .groupRangeFunction(config.groupRangeFunction)
  ;

  // add drawing function to charts
  charts[chartname].drawFunc = drawFunc;
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
    groupedModel.setDropdown(chartname, val);
  }
  catch (e) {
    handleError(e);
  }
}
