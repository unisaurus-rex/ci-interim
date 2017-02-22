import {getInsightsData} from 'model';
import {exportObj as groupStackModel} from 'groupStackModel';
import CtrlState from  'ctrlState';
import {InvalidTableError} from 'errorObjects';
import * as d3 from "d3";
import {stacksChart} from 'groupStack';

import Panel from "panel";
import Checkboxes from 'checkboxes';
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import {toolTips} from 'tooltips';

var groupStacks = {};

export var groupStackExport = {
  addGroupStack: addGroupStack

}

function addGroupStack(chartname, width, height, margins, elementIds ) {

  if (!groupStacks.hasOwnProperty(chartname)) {

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
    setObservers(chartname, elementIds);

    //set dropdown event listener
    addDropdownListener(chartname);

    //init drawFunc
    setDrawFunc(chartname);
    
    //draw chart
    draw(chartname);
  }

  return;
};



function setData(chartname){
  //set data in model
  let data = getData(chartname, groupStackModel.getDropdown(chartname));

  try{
    groupStackModel.setData(chartname, data);
  }
  catch(e){
    handleError(e.message);
  }
}

function buildData(chartname){
  //get and filter data
  let data = groupStackModel.getData(chartname, groupStackModel.getDropdown(chartname));
  let arr = groupStackModel.getAllChecked(chartname);
  groupedStackFilter(data, arr);

  return data;
}

function groupedStackFilter(data, checked){
  //update groups.columns on every array element
  for (var i=0; i< data.length; i++){
      data[i].groups.columns = checked;
    }
}

function draw(chartname) {
  if(groupStacks.hasOwnProperty(chartname)) {

    console.log("draw called");
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

function setObservers(chartname, elementIds){
  //set observersfunc and observers
  let cb=  observerCallbackBuilder (chartname);
  let observerFunc = addBootstrapCheckboxObservers()
    .elementIds(elementIds)
    .callback(cb);

  let observers = observerFunc();
  groupStacks[chartname].observers = observers;
  groupStacks[chartname].observerFunc = observerFunc;
  
}

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

function getDropdownDefaultName(chartname){
  //return current dropdown selection
  let selector = chartname + ' .dropdown-menu li a';
  let val = d3.select(selector);
  return val._groups[0][0].outerText;
}

function initPanelTitle(chartname){
  //update panel title
  let val = getDropdownDefaultName(chartname);
  updatePanelTitle(chartname, val);
}

function initDropdownText(chartname){
  //update dropdown text
  let val = getDropdownDefaultName(chartname);
  updateDropdownText(chartname, val);
}

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

function getDropdownDefaultValue(chartname) {
  //return column name
  let selector = chartname + ' .dropdown-menu li a';
  let val = d3.select(selector).attr('data-value');
  return val;
} 

function handleError(err) {
  console.log(err.message);
}

function buildContainer(chartname) {
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

function setDrawFunc(chartname) {
  //init draw function
  if(groupStacks.hasOwnProperty(chartname)) {
    groupStacks[chartname].drawFunc = stacksChart();
  } else {
    throw new InvalidTableError(chartname);
  }
}

function observerCallbackBuilder(chartname) {
  return function(value) {


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
  };
}

function dropdownCallbackBuilder(chartname) {
  // return d3 event callback
  return function(d) {

    // get dropdown values
    let current = d3.select(this).attr('data-value');

    //if dropdown has changed
    if ( current != groupStackModel.getDropdown(chartname)){
      setDropdown(chartname, current);

      groupStackModel.setDropdownChanged(chartname, true);
    
      // check all checkboxes
      let selector = chartname + " .checkboxes label";
      d3.selectAll(selector).classed('active', true);

      //update dropdown text
      updateDropdownText( chartname, d3.select(this).html());
      //update Panel Title
      updatePanelTitle( chartname, d3.select(this).html());

      setData(chartname); 

      if( groupStackModel.getResetCount(chartname) ==0 ){
        draw(chartname);
        groupStackModel.setDropdownChanged(chartname, false);
      }      
    }
  };
}

function updateDropdownText( chartname, text ){
  let selection = chartname + " button";
  let button = d3.select( selection );
  button._groups[0][0].innerHTML = text +  "<span class='caret'> </span>";
}

function updatePanelTitle( chartname, text){
  let selection = chartname + " h2";
  let title = d3.select(selection);

  title._groups[0][0].innerText = d3.select (title._groups[0][0]).attr("data-value") + ": "+ text;

}


function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li a";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}

export function getData( chartname, col ){
  function add(a, b) {
    return a + b;
  }
  //let data = groupStackModel.getData(chartname);

  let data = {};
  //get data for all txn types
  let pinDebitInsightsData = getInsightsData("pin_debit");
  let sigDebitInsightsData = getInsightsData("sig_debit");
  let sigCreditInsightsData = getInsightsData("sig_credit");

  delete pinDebitInsightsData.total;
  delete sigDebitInsightsData.total;
  delete sigCreditInsightsData.total;

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