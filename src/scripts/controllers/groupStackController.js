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

    let c = new CtrlState();
    groupStacks[chartname] = c;

    groupStackModel.addGroupStack(chartname);

    groupStackModel.setSvgSize(chartname, {width: width, height: height})
    groupStackModel.setMargins(chartname, margins)
    buildContainer(chartname);

    setDropdown(chartname);

    setCheckboxes(chartname);
    setObservers(chartname, elementIds);

    addDropdownListener(chartname);

    setDrawFunc(chartname);
    draw(chartname);
  }

  return;
};

function setData(chartname){
  let col = groupStackModel.getDropdown(chartname);
  let data = getData( col )
  groupStackModel.setData( data );
}


// Call the drawing function associated with a chartname
function draw(chartname) {
  if(groupStacks.hasOwnProperty(chartname)) {
    
    let arr = groupStackModel.getAllChecked(chartname);
    //console.log(arr);
    let d = getData( groupStackModel.getDropdown(chartname) )
     function groupedStackFilter(data, checked){
      //loop through data array
      for (var i=0; i< data.length; i++){
        //update columns to contain only what was checked
        data[i].groups.columns = data[i].groups.columns.filter( 
          function(d){ 
            if ( checked.indexOf(d) > -1 )
              return d;
          })
      }
  }


    
    ////console.log(charts[chartname].data, arr)
    groupedStackFilter( d, arr)
    //console.log(charts[chartname].data, arr)

    let loc = d3.select(chartname + " svg");

    groupStacks[chartname].drawFunc(loc, d);

    //Tooltips
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

    try{
      groupStackModel.addCheckboxes(chartname,  ["pin_debit", "sig_credit", "sig_debit"], [true, true, true]);
    }
    catch(e) {
      handleError(e);
    }
  
}

function setDropdown(chartname, val) {

  // if user did not pass in val, default to first dropdown list element
  if(val === undefined) {
    val = getDropdownDefault(chartname);
  }

  try {
    groupStackModel.setDropdown(chartname, val);
  }
  catch (e) {
    handleError(e);
  }
}

function getDropdownDefault(chartname) {
  let selector = chartname + ' .dropdown-menu li a';
  let val = d3.select(selector).attr('data-value');

  return val;
} 

function handleError(err) {
  console.log(err.message);
}

function buildContainer(chartname) {
  let size = groupStackModel.getSvgSize(chartname);
  let margins = groupStackModel.getMargins(chartname);

  var svgSelect = chartname + " .groupedStack";
  
  var groupedStackSvg = d3.select(svgSelect) 
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("class", "svg-content-responsive")
    .attr("viewBox", -margins.left + " " + -margins.right + " "+ size.width + " " + size.height)
  ;
}

function setDrawFunc(chartname) {
  if(groupStacks.hasOwnProperty(chartname)) {
    groupStacks[chartname].drawFunc = stacksChart();
  } else {
    throw new InvalidTableError(chartname);
  }
}


///**
// * @function observerCallbackBuilder 
// */
function observerCallbackBuilder(chartname) {
  return function(value) {
    if(groupStacks.hasOwnProperty(chartname)){
      let resetCount =  groupStackModel.getResetCount(chartname); 
      //if(resetCount == 0){
        groupStackModel.toggle(chartname, value);
        draw(chartname);
      //}
      //else if ( resetCount > 1 ){
      //  groupStackModel.toggle(chartname, value);
      //}else{
     //   draw(chartname);
      //}
    } else {
      throw new Error("Attempt to reference non-existent panel object");
    }
  };
}
//



function setResetCount(chartname) {
  if(groupStacks.hasOwnProperty(chartname)) {
    let cboxes = groupStackModel.getAllCheckboxes(chartname);
    let count = Object.keys(cboxes.getAll()).length - cboxes.getAllChecked().length;

    groupStacks[chartname].resetCount= count;

    //if count is 0 a checkmark event never gets fired, meaning the chart does not get redrawn but it needs to be
    if(count == 0){
      draw(chartname);
    }
  }
}

function dropdownCallbackBuilder(chartname) {
  // return d3 event callback
  return function(d) {

    // get dropdown values
    let current = d3.select(this).attr('data-value');
    console.log(current);
    //let old = groupStacks[chartname].dropdown;

    //if( current != old) {
      // set dropdown param
      setDropdown(chartname, current);
      //setDropdown(chartname);


      //UPDATE DATA
      //getData()(charts [chartname].dropdown);

      //set data in model
      //let data = getData( groupStackModel.getDropdown(chartname) )
      //groupStackModel.setData(chartname, data ); 
      //get data

      //charts[chartname].data = getData( charts[chartname].dropdown);

      // set reset count
      //setResetCount(chartname);
    
      // check all checkboxes
      let selector = chartname + " .checkboxes label";
      d3.selectAll(selector).classed('active', true);

      //update dropdown text
      updateDropdownText( chartname, d3.select(this).html());
      //update Panel Title
      updatePanelTitle( chartname, d3.select(this).html());

      draw(chartname);
    //}
  };
}

function updateDropdownText( chartname, text ){
  //console.log (chartname, text);
  let selection = chartname + " button";
  let button = d3.select( selection );
  button._groups[0][0].innerHTML = text +  "<span class='caret'> </span>";
}

function updatePanelTitle( chartname, text){
  let selection = chartname + " h2";
  let title = d3.select(selection);
  //console.log( d3.select (title._groups[0][0]).attr("data-value") );

  title._groups[0][0].innerText = d3.select (title._groups[0][0]).attr("data-value") + ": "+ text;

}


function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li a";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}

////pass in column
export function getData( col ){
  function add(a, b) {
    return a + b;
  }

  //get data for all txn types
  var pinDebitInsightsData = getInsightsData("pin_debit");
  var sigDebitInsightsData = getInsightsData("sig_debit");
  var sigCreditInsightsData = getInsightsData("sig_credit");

  //get all FI's
  var issuers = Object.keys(pinDebitInsightsData);
  issuers = issuers.map( function(d) { return {key: d}})
  issuers = issuers.filter( 
    function(d) { 
      if(d.key == "total"){
        return false;} 
      else 
        return true;})
  console.log(issuers)

  //loop through FIs
  for ( var i = 0; i< issuers.length; i++){
    issuers[i] ["groups"] = [];
    issuers[i] ["groups"] [0] = {};

    //add up pin debit for an FI (all mcc types)
    var pinDebArr = pinDebitInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
    var pinDebitTotal = pinDebArr.reduce(add, 0);
    issuers[i].groups[0] [ "pin_debit"] = pinDebitTotal;


    //add up sig debit for an FI (all mcc types)
    var sigDebArr = sigDebitInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
    var sigDebitTotal = sigDebArr.reduce(add, 0);
    issuers[i].groups[0] [ "sig_debit"] = sigDebitTotal;

    //add up sig credit for an FI (all mcc types)
    var sigCreditArr = sigCreditInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
    var sigCreditTotal = sigCreditArr.reduce(add, 0);
    issuers[i].groups[0] [ "sig_credit"] = sigCreditTotal;   

    //add total and columns attributes 
    issuers[i].groups[0] [ "total"] = 1;
    issuers[i].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
  }

  for ( var i = 0; i< issuers.length; i++){
    //get total for percentage
    var total = 0;
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