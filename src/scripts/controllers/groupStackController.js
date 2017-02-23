import {getInsightsData} from 'model';
import {exportObj as groupStackModel} from 'groupStackModel';
import CtrlState from  'ctrlState';
import * as d3 from "d3";
import {stacksChart} from 'groupStack';
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import {toolTips} from 'tooltips';

var groupStacks = {};

export var groupStackExport = {
  addGroupStack: addGroupStack
}

/***** Public Functions *****/

/**
 * @function addGroupStack
 * @param {String} chartname
 * @param {Int} width - Size of svg container. Object with width and height properties
 * @param {Int} height - Margin widths of svg container. Object with top, left, bottom and right properties
 * @param {Object} margins - Margin containing values for top, left, right, and bottom 
 */
function addGroupStack(chartname, width, height, margins) {

  if (!groupStacks.hasOwnProperty(chartname)) {

    try{
      //create object to store controller state
      let c = new CtrlState();
      groupStacks[chartname] = c;


      //Add chart to model
      groupStackModel.addGroupStack(chartname);

      //Set size, draw svg
      groupStackModel.setSvgSize(chartname, {width: width, height: height})
      groupStackModel.setMargins(chartname, margins)
      buildContainer(chartname);

      //Initialize dropdown in model
      setDropdown(chartname);

      //Update the panel title and text
      initDropdownText(chartname);
      initPanelTitle(chartname);
      
      //init dropdownChanged in model
      groupStackModel.setDropdownChanged(chartname, false);
      
      //set data in model
      setData(chartname);

      //set checkboxes in model
      setCheckboxes(chartname);
      //set observers in ctrlState
      setObservers(chartname);

      //set dropdown event listener
      addDropdownListener(chartname);

      //init drawFunc
      setDrawFunc(chartname);
      
      //draw chart
      draw(chartname);
    }
    catch(e){
      handleError(e.message);
    }
  }

  return;
};

/***** Private Functions *****/

/**
* Set the data needed for the chart 
* @function setData
* @private
* @param {String} chartname - css selector for chart
*/
function setData(chartname){
  try{
    //set data in model
    let data = getData(chartname, groupStackModel.getDropdown(chartname));
    groupStackModel.setData(chartname, data);
  }
  catch(e){
    handleError(e.message);
  }
}

/**
* Return the filtered data based on checkmarks
* @function buildData
* @private
* @param {String} chartname - css selector for chart
*/
function buildData(chartname){
  try{  
    let dropdown = groupStackModel.getDropdown(chartname);
    //get and filter data
    let data = groupStackModel.getData(chartname, dropdown);
    let arr = groupStackModel.getAllChecked(chartname);
    groupedStackFilter(data, arr);

    return data;
  }
  catch(e){
    handleError(e.message);
  }
}

/**
* Return the filtered data based on checkmarks
* @function groupedStackFilter
* @private
* @param {String} chartname - css selector for chart
* @returns {Object []}
*/
function groupedStackFilter(data, checked){
  //update groups.columns on every array element
  for (var i=0; i< data.length; i++){
      data[i].groups.columns = checked;
    }
}

/**
 * Draw the chart associated with chartname
 * @function draw
 * @param {String} chartname
 */
function draw(chartname) {
  if(groupStacks.hasOwnProperty(chartname)) {
    //update data    
    let d = buildData( chartname )
    //get selection string
    let loc = d3.select(chartname + " svg");
    //draw chart
    groupStacks[chartname].drawFunc(loc, d);
    //tooltips
    toolTips();
  }  
}

/**
 * Set the observers and observersFunc
 * @function setObservers
 * @param {String} chartname
 */
function setObservers(chartname){
  let ids = []; // holds id of each element that needs an observer
  let selector = `${chartname} .checkboxes label`; 
  let labels = d3.selectAll(selector);

  // use labels selection to get id of each label element
  labels.each( function(d) {
    ids.push(d3.select(this).attr('id'));
  });

  //set observersfunc and observers
  let cb=  observerCallbackBuilder (chartname);
  let observerFunc = addBootstrapCheckboxObservers()
    .elementIds(ids)
    .callback(cb);

  let observers = observerFunc();
  groupStacks[chartname].observers = observers;
  groupStacks[chartname].observerFunc = observerFunc;
}

/**
 * Set the checkboxes in the model
 * @function setCheckboxes
 * @param {String} chartname
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

 // add checkboxes to groupeStackModel
  try{
    groupStackModel.addCheckboxes(chartname, vals, defaults);
  }
  catch(e) {
    handleError(e);
  }
}

/**
 * Get the current dropdown name
 * @function getDropdownDefaultName
 * @param {String} chartname
 */
function getDropdownDefaultName(chartname){
  //return current dropdown selection
  let selector = chartname + ' .dropdown-menu li a';
  let val = d3.select(selector);
  //console.log(val, val.html(), val.text())
  return val.html();
}

/**
 * Initialize panel title
 * @function initPanelTitle
 * @param {String} chartname
 */
function initPanelTitle(chartname){
  //update panel title
  let val = getDropdownDefaultName(chartname);
  updatePanelTitle(chartname, val);
}

/**
 * Initialize dropdown text
 * @function initDropdownText
 * @param {String} chartname
 */
function initDropdownText(chartname){
  //update dropdown text
  let val = getDropdownDefaultName(chartname);
  updateDropdownText(chartname, val);
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
    val = getDropdownDefaultValue(chartname);
  }

  try {
    groupStackModel.setDropdown(chartname, val);
  }
  catch (e) {
    handleError(e);
  }
}

/**
* Get the first item in chartname's dropdown list
* @private
* @function getDropdownDefaultValue
* @param {String} chartname
* @return {String} value of the first dropdown item
*/
function getDropdownDefaultValue(chartname) {
  //return column name
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
 * add the svg container for the chart to dom
 * @private
 * @function buildContainer
 * @param {String} chartname - css selector for chart
 */
function buildContainer(chartname) {
  try {
    //get svg attributes from model
    let size = groupStackModel.getSvgSize(chartname);
    let margins = groupStackModel.getMargins(chartname);
    //get selection string
    let svgSelect = chartname + " .groupStack";
    
    //draw svg
    let groupedStackSvg = d3.select(svgSelect) 
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("class", "svg-content-responsive")
      .attr("viewBox", -margins.left + " " + -margins.right + " "+ size.width + " " + size.height)
    ;
  }
  catch (e) {
    handleError(e);
  }
}

/**
* Create a drawing function and store it in the charts
* @private
* @function setDrawFunc
* @param {String} chartname - css selector for chart
* @param {Object} config - groupedBarConfig object
*/
function setDrawFunc(chartname) {
  //init draw function
  if(groupStacks.hasOwnProperty(chartname)) {
    groupStacks[chartname].drawFunc = stacksChart();
  } else {
    throw new InvalidTableError(chartname);
  }
}

/**
* Return function to be called when a checkbox input changes
* @function observerCallbackBuilder
* @param {String} chartname
* @return {function} 
*/
function observerCallbackBuilder(chartname) {
  return function(value) {
    try {
      if(groupStacks.hasOwnProperty(chartname)){
        let resetCount =  groupStackModel.getResetCount(chartname);
        let dropdownChanged = groupStackModel.getDropdownChanged(chartname); 

        if (dropdownChanged === true){
          if(resetCount == 1){
            groupStackModel.toggle(chartname, value);
            groupStackModel.setDropdownChanged(chartname, false);
            draw(chartname);  
          }
          else{
            groupStackModel.toggle(chartname, value);  
          }
        } else{
          groupStackModel.toggle(chartname, value);
          draw(chartname);
        }
      } else {
        throw new Error("Attempt to reference non-existent panel object");
      }
    }
    catch (e) {
      handleError(e);
    }
  };
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

      //if dropdown has changed
      if ( current != groupStackModel.getDropdown(chartname)){
        setDropdown(chartname, current);

        groupStackModel.setDropdownChanged(chartname, true);
        setData(chartname);

        if(groupStackModel.getResetCount(chartname) == 0) {
          // if resetCount is 0, checkbox observers won't trigger a draw
          draw(chartname);
          groupStackModel.setDropdownChanged(chartname, false);
        } else {
          // check all checkboxes and let the observers handle the drawing
          let selector = `${chartname} .checkboxes label`;
          d3.selectAll(selector).classed('active', true);
        }
      
        //update dropdown text
        updateDropdownText( chartname, d3.select(this).html());
        //update Panel Title
        updatePanelTitle( chartname, d3.select(this).html());

        if( groupStackModel.getResetCount(chartname) ==0 ){
          draw(chartname);

        }      
      }
    }
    catch (e) {
      handleError(e);
    }
  };
}

/**
 * Change the dropdown button text for a chart
 * @function updateDropdownText
 * @param {String} chartname
 * @param {String} text - text of selected button from dropdown
 */
function updateDropdownText( chartname, text ){
  let selection = `${chartname} button`;
  let button = d3.select( selection );
  let buttonText = `${text} <span class='caret'> </span>`;
  button.html(buttonText);
}

/**
 * @function updatePanelTitle
 * @param {String} chartname
 * @param {String} text - text of selected button from dropdown
 */
function updatePanelTitle( chartname, text){
  let selection = `${chartname} h2`;
  let title = d3.select(selection);
  let titleText = `${title.attr("data-value")}: ${text}`; 

  title.html(titleText);
}

/**
 * @function addDropdownListener
 * @param {String} chartname
 */
function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li a";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}


/**
 * Return data given a column name
 * @function getData
 * @param {String} chartname
 * @param {String} col
 */
export function getData( chartname, col ){
  function add(a, b) {
    return a + b;
  }
  
  //get data for all txn types
  let pinDebitInsightsData = getInsightsData("pin_debit");
  let sigDebitInsightsData = getInsightsData("sig_debit");
  let sigCreditInsightsData = getInsightsData("sig_credit");

  //get all FI's
  let issuers = Object.keys(pinDebitInsightsData);
  issuers = issuers.map( function(d) { return {key: d}})


  //loop through FIs
  for ( let i = 0; i< issuers.length; i++){
    issuers[i] ["groups"] = [];
    issuers[i] ["groups"] [0] = {};

    //add up pin debit for an FI (all mcc types)
    let pinDebArr = pinDebitInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
    let pinDebitTotal = pinDebArr.reduce(add, 0);
    issuers[i].groups[0] [ "pin_debit"] = pinDebitTotal;


    //add up sig debit for an FI (all mcc types)
    let sigDebArr = sigDebitInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
    let sigDebitTotal = sigDebArr.reduce(add, 0);
    issuers[i].groups[0] [ "sig_debit"] = sigDebitTotal;

    //add up sig credit for an FI (all mcc types)
    let sigCreditArr = sigCreditInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
    let sigCreditTotal = sigCreditArr.reduce(add, 0);
    issuers[i].groups[0] [ "sig_credit"] = sigCreditTotal;   

    //add total and columns attributes 
    issuers[i].groups[0] [ "total"] = 1;
    issuers[i].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
  }

  for ( let i = 0; i< issuers.length; i++){
    //get total for percentage
    let total = 0;
    total = total + issuers[i].groups[0] ["sig_debit"];
    total = total + issuers[i].groups[0] ["pin_debit"];
    total = total +issuers[i].groups[0] ["sig_credit"];
    
    //get percentages
    issuers[i].groups[0] ["sig_debit"] = issuers[i].groups[0] ["sig_debit"] / total;
    issuers[i].groups[0] ["pin_debit"] = issuers[i].groups[0] ["pin_debit"] / total;
    issuers[i].groups[0] ["sig_credit"] = issuers[i].groups[0] ["sig_credit"] / total;
  }

  return issuers;
}
