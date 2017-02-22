import {getInsightsData} from 'model';
import {exportObj as groupedModel} from 'groupedBarModel' ;
import CtrlState from 'ctrlState';
import * as d3 from "d3";
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import groupedBarChart from 'groupedBar';
import {toolTips} from 'tooltips';


var charts = {};

export var groupedExport = {
  addGraph: addGraph
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
    setCheckboxes(chartname);

    // set draw function
    setDrawFunc(chartname, config);

    /*** Actions (setup container, add listeners, draw graph) ***/

    // add svg container
    buildContainer(chartname);

    // add checkbox listeners
    addCheckboxListeners(chartname);

    // add dropdown listener
    addDropdownListener(chartname);

    // initialize panel title and dropdown title
    updateDropdownText(chartname);
    updatePanelTitle(chartname);

    // draw the chart
    draw(chartname);
  }

}



/***** Private Functions *****/

/**
 * @private
 * @function addCheckboxListeners
 * @param {String} chartname
 */
function addCheckboxListeners(chartname) {
  let cb = observerCallbackBuilder(chartname);

  // need to observe the label element wrapping the input item because these are bootstrap checkboxes
  // get the ids of each label item so we can pass them to addBootstrapCheckboxObserver
  let ids = []; // holds id of each element that needs an observer
  let selector = `${chartname} .checkboxes label`; 
  let labels = d3.selectAll(selector);

  // use labels selection to get id of each label element
  labels.each( function(d) {
    ids.push(d3.select(this).attr('id'));
  });

  let observerFunc = addBootstrapCheckboxObservers()
      .elementIds(ids)
      .callback(cb);

  let observers = observerFunc();

  charts[chartname].observerFunc = observerFunc;
  charts[chartname].observers = observers;
}

/**
 * @private
 * @function addDropdownListener
 * @param {String} chartname
 */
function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li a";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}

/**
 * add the svg container for the chart to dom
 * @private
 * @function buildContainer
 * @param {String} chartname - css selector for chart
 */
function buildContainer(chartname){
  // groupedModel may throw error when accessing svgSize or svgMargins
  try{
    let {width, height} = groupedModel.getSvgSize(chartname);
    let {left, top} = groupedModel.getMargins(chartname);
    let svgSelect = chartname + " .grouped";

    let gBarSvg = d3.select(svgSelect)
        .append("div")
        .classed("svg-container", true)
        .append("svg")  
        .attr("viewBox", "-" + left + " -"+ top + " "+ width + " " + height)
        .classed("svg-content-responsive", true)
    ;
  }
  catch(e) {
    handleError(e);
  }

}

/**
 * Format the data so it can be passed to groupedBar drawing function
 * @private
 * @function buildData
 * @param {String} chartname
 * @param {String[]} mccNames - array of mcc names to filter data on
 * @returns {Array}
 */
function buildData(chartname, mccNames) {
  try{
    let data = groupedModel.getData(chartname);
    let dropdown = groupedModel.getDropdown(chartname);
    return filterByCheckbox( filterByDropdown(data, dropdown), mccNames);
  }
  catch(e){
    handleError(e);
  }
}

/**
 * Draw the chart associated with chartname
 * @function draw
 * @param {String } chartname
 */
function draw(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    
    try{
      // selector for locating the drawing functions target
      let chartSelector = `${chartname} svg`;

      // determine what mcc values to display data for 
      let mccNames = groupedModel.getAllChecked(chartname);
      mccNames.push( "Issuer" );

      // use mcc values to filter data for display
      let data = buildData(chartname, mccNames);

      // get chart drawing target as d3 selection
      let loc = d3.select(chartSelector);

      // draw chart
      charts[chartname].drawFunc.column(groupedModel.getDropdown(chartname));
      charts[chartname].drawFunc(loc, data);

      // add tooltip
      toolTips();
    }
    catch(e) {
      handleError(e);
    }
  }  
}

/**
 * Return a function to call after the the dropdown is selected
 * Returned function will update the dropdown selection and trigger the
 * redraw process
 * @function dropdownCallbackBuilder
 * @param {String} chartname
 * @returns {Function} 
 */
function dropdownCallbackBuilder(chartname) {
  // return d3 event callback
  return function(d) {
    try {
      // get dropdown values
      let current = d3.select(this).attr('data-value');

      let old = groupedModel.getDropdown(chartname);

      if( current != old) {
        // set dropdown param
        groupedModel.setDropdown(chartname, current);

        // set dropdownChanged
        groupedModel.setDropdownChanged(chartname);

        if(groupedModel.getResetCount(chartname) == 0) {
          // if resetCount is 0, checkbox observers won't trigger a draw
          draw(chartname);
        } else {
          // check all checkboxes and let the observers handle the drawing
          let selector = `${chartname} .checkboxes label`;
          d3.selectAll(selector).classed('active', true);
        }
      
        //update dropdown text
        updateDropdownText( chartname, d3.select(this).text());
        //update Panel Title
        updatePanelTitle( chartname, d3.select(this).text());
      }
    }
    catch(e) {
      handleError(e);
    }
  };
}

/**
 * Take insights data for a transaction type, remove all values that do not match the dropdown param and return an array
 * @private
 * @function filterByDropdown
 * @function {Object} data - data to filter
 * @function {String} dropdown - dropdown value to get data for
 */
function filterByDropdown(data, dropdown) {
  let issuers = Object.keys(data) ;
  let groupedBarData = [];

  for(let i=0; i< issuers.length; i++){  
    //map Issuer to issuer to fi for every fi
    groupedBarData[i] = {
      Issuer: issuers[i]
    }

    //map every mcc_name to fee_pc for every fi
    for ( let j = 0; j < data[ [issuers[i] ] ].length; j++){
      groupedBarData[i] [data [issuers[i] ] [j].mcc_name] = data [issuers[i] ] [j] [dropdown];
    }
  }
  let jsonGroupNames = d3.keys(groupedBarData[0]).filter(function(key) { return key !== "Issuer"; });

  groupedBarData.forEach(function(d) {
    d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  groupedBarData.columns = jsonGroupNames;

  return groupedBarData;	
}

/**
 * Take an array of fi's for a transaction type and drop any mcc objects not in mccNames, return the array
 * @private
 * @function filterByCheckbox
 * @param {Array} data - data to filter
 * @param {String[]} mccNames - array of mcc names checked 
 */
function filterByCheckbox(data, mccNames) {
  let filteredData = data.map( (d) => {
    return mccNames.reduce( (result, key) => {result[key] = d[key];
                                              return result;}, {});
  });  

  //add group attribute
  let jsonGroupNames = d3.keys(filteredData[0]).filter(function(key) { return key !== "Issuer"; });

  filteredData.forEach(function(d) {
    d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  filteredData.columns = jsonGroupNames;

  return filteredData;
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
 * Return function to be called when a checkbox input changes
 * @private
 * @function observerCallbackBuilder
 * @param {String} chartname
 * @return {function} 
 */
function observerCallbackBuilder(chartname) {
  return function(value) {
    try {
      if(groupedModel.getDropdownChanged(chartname)){
        // only want to redraw the graph once.  if the dropdown changed
        // wait until there is only one checkbox left to toggle before drawing 
        if(groupedModel.getResetCount(chartname) > 1){
          // count greater than 1, toggle checkbox and do nothing else
          groupedModel.toggle(chartname, value);
        } else {
          // count == 1, time to do work
          // toggle checkbox
          groupedModel.toggle(chartname, value);

          // draw
          draw(chartname);

          // reset the dropdownChanged so drawing isn't messed up later
          groupedModel.unsetDropdownChanged(chartname);
        } 
      } else {
        // dropdown didn't change, toggle and draw
        groupedModel.toggle(chartname, value);
        draw(chartname);
      }
    }
    catch(e) {
      handleError(e);
    }
  };
}

/**
 * add checkboxes to model state
 * @private
 * @function setCheckboxes
 * @param {String} chartname - css selector for chart
 */
function setCheckboxes(chartname) {
  // select all chart checkboxes
  let vals = [];
  let defaults = [];
  // checkboxes use bootstrap style (input wrapped in label)
  let selector = `${chartname} .checkboxes label`; 
  let labels = d3.selectAll(selector);

  // use labels selection to populate defaults and vals
  labels.each(function(d) {
    // presence of active class indicates the box is checked
    defaults.push(d3.select(this).classed('active'));

    // get checkbox value from input element
    vals.push(d3.select(this).select('input').attr('value'));
  });

  // add checkboxes to groupedModel
  try{
    groupedModel.addCheckboxes(chartname, vals, defaults);
  }
  catch(e) {
    handleError(e);
  }
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
  
  // groupedModel may throw error when calling getSvgSize and getMargins
  try {
    // need svgSize and svgMargins for configuring the drawing function 
    let {width, height} = groupedModel.getSvgSize(chartname);
    let {left, right, top, bottom} = groupedModel.getMargins(chartname);

    let drawFunc = groupedBarChart() 
        .width( width - left - right)
        .height(height - top - bottom)
        .classMap(config.classMap)
        .classMapFunction(config.classMapFunction)
        .groupRangeFunction(config.groupRangeFunction)
    ;

    // add drawing function to charts
    charts[chartname].drawFunc = drawFunc;
  }
  catch(e) {
    handleError(e);
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
    groupedModel.setDropdown(chartname, val);
  }
  catch (e) {
    handleError(e);
  }
}

/**
 * Change the dropdown button text for a chart. If no text provided,
 * uses the text from the first dropdown option
 * @private
 * @function updateDropdownText
 * @param {String} chartname
 * @param {String} [text] - text of selected button from dropdown
 */
function updateDropdownText( chartname, text ){
  // check if text was specified, if not, get default value
  if(text === undefined) {
    text = getDropdownDefaultName(chartname);
  }

  let selection = `${chartname} button`;
  let button = d3.select( selection );
  let buttonText = `${text} <span class='caret'> </span>`;
  button.html(buttonText);
}

/**
 * @private
 * @function updatePanelTitle
 * @param {String} chartname
 * @param {String} text - text of selected button from dropdown
 */
function updatePanelTitle( chartname, text){
  // check if text was specified, if not, get default value
  if(text === undefined) {
    text = getDropdownDefaultName(chartname);
  }

  let selection = `${chartname} h2`;
  let title = d3.select(selection);
  let titleText = `${title.attr("data-value")}: ${text}`; 

  title.html(titleText);
}

/**
 * Get the text of the first dropdown option for a chart
 * @private
 * @function getDropdownDefaultName
 * @param {String} chartname
 * @return {String} 
 */
function getDropdownDefaultName(chartname){
  //return first dropdown option 
  let selector = chartname + ' .dropdown-menu li a';
  let val = d3.select(selector);
  return val.text();;
}
