import {getInsightsData} from 'model';
import * as d3 from "d3";
import Panel from "panel";
import {stacksChart} from 'groupedStack';
import Checkboxes from 'checkboxes';
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import {toolTips} from 'tooltips';

var charts = {};

window.gcharts = charts;

export var groupStackedExport = {
  setSvgSize: setSvgSize,
  setMargins: setMargins,
  buildData: buildData,
  drawSvg: drawSvg,
  draw: draw,
  createDrawingFunc: createDrawingFunc,
  toggleCheckbox: toggleCheckbox,
  observerCallbackBuilder: observerCallbackBuilder,
  initObservers: initObservers,
  addDropdownListener: addDropdownListener
}

//var getData;
window.d3 = d3;

/**
 * @function createDrawingFunc
 * @param {Object} config - stackConfig object
 */
function createDrawingFunc(chartname, config) {

  let func = stacksChart() 
      .width( charts[chartname].svg.width)
      .height(charts[chartname].svg.height)
      .margin( charts[chartname].svg.margins )
  ;

  // create new object for chartname if it doesn't exisit
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.drawFunc = func;
    charts[chartname] = p;
  } else {
    // update drawing function in charts
    charts[chartname].drawFunc = func;
  }
}

// Call the drawing function associated with a chartname
function draw(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    
    let arr = charts[chartname].cboxes.getAllChecked();


     function groupedStackFilter(data, checked){
      //loop through data array
//      for (var i=0; i< data.length; i++){
//        //update columns to contain only what was checked
//        charts[chartname].data[i].groups.columns = charts[chartname].data[i].groups.columns.filter( 
//          function(d){ 
//            if ( checked.indexOf(d) > -1 )
//              return d;
//          })


      for (var i=0; i< data.length; i++){
        //update columns to contain only what was checked
        charts[chartname].data[i].groups.columns = checked;
    }
  }

    
    //console.log(charts[chartname].data, arr)
    groupedStackFilter(charts[chartname].data, arr)
    //console.log(charts[chartname].data, arr)

    let loc = d3.select(chartname + " svg");

    charts[chartname].drawFunc(loc, charts[chartname].data);

    //Tooltips
    toolTips();
  }  
}

/**
 * @function setSvgSize
 */
function setSvgSize(chartname, width, height){
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.svg.width = width;
    p.svg.height = height;

    charts[chartname] = p;
  }
  else{
    charts[chartname].svg.width = width;
    charts[chartname].svg.height = height;
  }
}

function setMargins(chartname, margins){
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel(); 
    p.svg.margins = margins;

    charts[chartname] = p;
  }
  else{
    charts[chartname].svg.margins = margins;
  }
}

function drawSvg(chartname){

  var width = charts[chartname].svg.width;
  var height = charts[chartname].svg.height;
  
  var svgSelect = chartname + " .groupedStack";

  var groupedStackSvg = d3.select(svgSelect) 
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("class", "svg-content-responsive")
    .attr("viewBox", -charts[chartname].svg.margins.left + " " + -charts[chartname].svg.margins.right + " "+ width + " " + height)
  ;
}

/**
 * add or update chartname.data based on txnType and fi
 */
function buildData(chartname) {

  //getData = getSegmentData().fi(fi).column(column);
  
  // if chartname object doesn't exist, build new object and add data property
  //chartname is the selector for the panel
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();

    var dropDownSelect = chartname + " .dropdown-menu li a";
    p.dropdown = d3.select( dropDownSelect ).attr("data-value");
    //console.log( dropdownSelect, p.dropdown)

    p.data = getData( p.dropdown );

    charts[chartname] = p;


  }
  else{
   var dropDownSelect = chartname + " .dropdown-menu li a";
    charts[chartname].dropdown = d3.select( dropDownSelect ).attr("data-value"); 
  
    charts[chartname].data = getData( charts[chartname].dropdown);
  }
    //update dropdown
  updateDropdownText( chartname, d3.select(dropDownSelect).html());
  updatePanelTitle( chartname, d3.select(dropDownSelect).html());
}

/*
 * @function addCheckboxes
 */
function addCheckboxes(chartname, valArr, defaultArr) {
  let cboxes = new Checkboxes(valArr, defaultArr);

  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.cboxes = cboxes;
       
    charts[chartname] = p;
  } else {
    charts[chartname].cboxes = cboxes;
  } 
}

/**
 * @function toggleCheckbox
 */
function toggleCheckbox(chartname, value) {
  if(charts.hasOwnProperty(chartname)){
    if(charts[chartname].cboxes != null){
      return charts[chartname].cboxes.toggle(value);
    }
  } else {
    throw new Error("Attempt to reference non-existent panel object");
  }
} 

/**
 * @function observerCallbackBuilder 
 */
function observerCallbackBuilder(chartname) {
  return function(value) {
    if(charts.hasOwnProperty(chartname)){

      let chart = charts[chartname];
      let resetCount = chart.resetCount;

      // resetCount is used to insure that on a dropdown change, the svg is only redrawn once,
      // if we don't use resetCount, the svg will be redrawn once for every unchecked checkbox
      if(resetCount == 0) {
        // dropdown paramater has not changed, only the checkbox values

        // toggle checkbox value in charts[chartname]
        chart.cboxes.toggle(value);
        draw(chartname);
      } else if(resetCount > 1) {
        chart.cboxes.toggle(value);
        chart.resetCount -= 1;
      } else {
        // reset == 1
        // dropdown parameter has changed, time to do work

        // update resetCount
        chart.resetCount -= 1;

        // toggle checkbox value in charts[chartname]
        chart.cboxes.toggle(value);

        // call draw 
        draw(chartname);
      }
    } else {
      throw new Error("Attempt to reference non-existent panel object");
    }
  };
}

/**
 * Create mutation observers and track them in the charts object
 * @function initObservers
 */
function initObservers(chartname, idArr, valArr, defaultArr, callback){
  addCheckboxes(chartname, valArr, defaultArr); 

  let observerFunc = addBootstrapCheckboxObservers()
      .elementIds(idArr)
      .callback(callback);

  let observers = observerFunc();

  // if charts.chartname does not exist, build it 
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.observers = observers; 
    p.observerFunc = observerFunc;
  } else {
    charts[chartname].observerFunc = observerFunc;
    charts[chartname].observers = observers;
  }
  
}

function setDropdown(chartname, value) {
  if(charts.hasOwnProperty(chartname)){
    charts[chartname].dropdown = value; 
  } else {
    throw new Error("Attempt to add dropdown parameter to non-existent panel object in charts");
  }
}

function setResetCount(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    let cboxes = charts[chartname].cboxes;
    let count = Object.keys(cboxes.getAll()).length - cboxes.getAllChecked().length;

    charts[chartname].resetCount= count;

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
    let old = charts[chartname].dropdown;

    if( current != old) {
      // set dropdown param
      setDropdown(chartname, current);

      //UPDATE DATA
      //getData()(charts [chartname].dropdown);
      charts[chartname].data = getData( charts[chartname].dropdown);

      // set reset count
      setResetCount(chartname);
    
      // check all checkboxes
      let selector = chartname + " .checkboxes label";
      d3.selectAll(selector).classed('active', true);

      //update dropdown text
      updateDropdownText( chartname, d3.select(this).html());
      //update Panel Title
      updatePanelTitle( chartname, d3.select(this).html());
    }
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

export function getData( col ){

  //var col = "n_trans";
  function add(a, b) {
    return a + b;
}


    var pinDebitInsightsData = getInsightsData("pin_debit");
    var sigDebitInsightsData = getInsightsData("sig_debit");
    var sigCreditInsightsData = getInsightsData("sig_credit");

    var issuers = Object.keys(pinDebitInsightsData);
    var issuers = issuers.map( function(d) { return {key: d}})


    for ( var i = 0; i< issuers.length; i++){
      issuers[i] ["groups"] = [];
      issuers[i] ["groups"] [0] = {};
 
      var pinDebArr = pinDebitInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
      var pinDebitTotal = pinDebArr.reduce(add, 0);
      issuers[i].groups[0] [ "pin_debit"] = pinDebitTotal;


      var sigDebArr = sigDebitInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
      var sigDebitTotal = sigDebArr.reduce(add, 0);
      issuers[i].groups[0] [ "sig_debit"] = sigDebitTotal;

      var sigCreditArr = sigCreditInsightsData[ issuers[i] ["key"]].map( function (d){ return d[ col]})
      var sigCreditTotal = sigCreditArr.reduce(add, 0);
      issuers[i].groups[0] [ "sig_credit"] = sigCreditTotal;   

      issuers[i].groups[0] [ "total"] = 1;
      issuers[i].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
    }

    //sum up issuers.groups[0]
    for ( var i = 0; i< issuers.length; i++){
      var total = 0;
      total = total + issuers[i].groups[0] ["sig_debit"];
      total = total + issuers[i].groups[0] ["pin_debit"];
      total = total +issuers[i].groups[0] ["sig_credit"];
      
      issuers[i].groups[0] ["sig_debit"] = issuers[i].groups[0] ["sig_debit"] / total;
      issuers[i].groups[0] ["pin_debit"] = issuers[i].groups[0] ["pin_debit"] / total;
      issuers[i].groups[0] ["sig_credit"] = issuers[i].groups[0] ["sig_credit"] / total;

    }

    return issuers;
}