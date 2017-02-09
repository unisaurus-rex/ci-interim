/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';
import * as d3 from "d3";

/***** local packages *****/
import {groupedExport} from 'groupedBarController';
import groupedBarConfig from "groupedBarConfig";
import {donutExport} from 'donutController';
import donutConfig from "donutConfig";
import stackConfig from "stackConfig";
import {stackExport} from 'stackedController';
import {tableExport, testing} from 'tableController';
import {toolTips} from 'tooltips';
import {stacksChart} from 'groupedStack';

import {getInsightsData} from 'model';


  var insightsData = getInsightsData(); // result is object with keys for each fi and values of arrays of objects
  var test = insightsData;
  console.log(test);

window.d3 = d3;
//change company name
function updateCompanyName(title){
  d3.select("#navbar li")._groups[0][0].innerHTML = 
  "<a>" + title+ " |" + "<strong> 2017 </string> </a>" 
  //d3.select("#navbar li")[0][0].textContent
}

updateCompanyName( " something else");
//Tooltips
toolTips();

/************************************************ ALL GROUPED BAR CHARTS ************************************************/

//set up SVG and margins
var groupedWidth = 400;
var groupedHeight = 150;
var groupedMargin = {top: 20, right: 20, bottom: 20, left: 20};

var classMap =  {"Department Stores": "fill-blue", "Grocery": "fill-red",
                 "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
                 "Drug Store": "fill-teal", "Other": "fill-gray-dark" };

// stuff to pass to config
var classMapFunctionBar = function (d){
  return classMap[ d.name ];
}

var groupRangeFunction = function(d) { return "translate(" + x0(d.Issuer) + ",0)"; };

//Create config for drawing function
var groupedConfig = new groupedBarConfig()
    .setClassMap(classMap)
    .setClassMapFunction(classMapFunctionBar)
    .setGroupRangeFunction(groupRangeFunction)
;
var groupedVals = ['Department Stores', 'Drug Store', 'Family Clothing', 'Fast Food', "Grocery", "Other" ];
var groupedDefaults = [true, true, true, true, true, true];

/***********************************************************************************************************************/


/************************************************ SIG DEBIT ************************************************/

/*********************** SIG DEBIT GROUPED BAR *********************/
var sigDebitSelector =  "#sigDebitGrouped";
groupedExport.setSvgSize(sigDebitSelector, groupedWidth, groupedHeight);

groupedExport.setMargins(sigDebitSelector, groupedMargin);
groupedExport.drawSvg(sigDebitSelector);

//Build data
groupedExport.buildData(sigDebitSelector, "sig_debit");

//Setup checkboxes
var sigDebitGroupedIds = ['groupedCbox1', 'groupedCbox2', 'groupedCbox3', 'groupedCbox4', 'groupedCbox5', "groupedCbox6"];

var sigDebitGroupedCb = groupedExport.observerCallbackBuilder(sigDebitSelector);
groupedExport.initObservers(sigDebitSelector, sigDebitGroupedIds, groupedVals, groupedDefaults, sigDebitGroupedCb);

//Draw chart
groupedExport.createDrawingFunc(sigDebitSelector, groupedConfig);
groupedExport.draw(sigDebitSelector);

//Add dropdown event listeners
groupedExport.addDropdownListener(sigDebitSelector);

/*********************** SIG DEBIT TABLE *********************/
// add table to page
tableExport.addTable(sigDebitSelector);

// get data for drawing the table
tableExport.setData(sigDebitSelector, "sig_debit");

// draw the table
tableExport.createDrawingFunc(sigDebitSelector);
tableExport.draw(sigDebitSelector);
tableExport.addDropdownListener(sigDebitSelector);


/************************************************ PIN DEBIT ************************************************/

/*********************** PIN DEBIT GROUPED BAR *********************/
var pinDebitSelector =  "#pinDebitGrouped";
groupedExport.setSvgSize(pinDebitSelector, groupedWidth, groupedHeight);

groupedExport.setMargins(pinDebitSelector, groupedMargin);
groupedExport.drawSvg(pinDebitSelector);

//Build data
groupedExport.buildData(pinDebitSelector, "pin_debit");

//Setup checkboxes
var pinDebitGroupedIds = ['groupedCbox7', 'groupedCbox8', 'groupedCbox9', 'groupedCbox10', 'groupedCbox11', "groupedCbox12"];

var pinDebitGroupedCb = groupedExport.observerCallbackBuilder(pinDebitSelector);
groupedExport.initObservers(pinDebitSelector, pinDebitGroupedIds, groupedVals, groupedDefaults, pinDebitGroupedCb);

//Draw chart
groupedExport.createDrawingFunc(pinDebitSelector, groupedConfig);
groupedExport.draw(pinDebitSelector);

//Add dropdown event listeners
groupedExport.addDropdownListener(pinDebitSelector);

/*********************** PIN DEBIT TABLE *********************/
// add table to page
tableExport.addTable(pinDebitSelector);

// get data for drawing the table
tableExport.setData(pinDebitSelector, "pin_debit");

// draw the table
tableExport.createDrawingFunc(pinDebitSelector);
tableExport.draw(pinDebitSelector);
tableExport.addDropdownListener(pinDebitSelector);


/************************************************ SIG CREDIT ************************************************/

/*********************** SIG CREDIT GROUPED BAR *********************/
var sigCreditSelector =  "#sigCreditGrouped";
groupedExport.setSvgSize(sigCreditSelector, groupedWidth, groupedHeight);

groupedExport.setMargins(sigCreditSelector, groupedMargin);
groupedExport.drawSvg(sigCreditSelector);

//Build data
groupedExport.buildData(sigCreditSelector, "sig_credit");

//Setup checkboxes
var sigCreditGroupedIds = ['groupedCbox13', 'groupedCbox14', 'groupedCbox15', 'groupedCbox16', 'groupedCbox17', "groupedCbox18"];

var sigCreditGroupedCb = groupedExport.observerCallbackBuilder(sigCreditSelector);
groupedExport.initObservers(sigCreditSelector, sigCreditGroupedIds, groupedVals, groupedDefaults, sigCreditGroupedCb);

//Draw chart
groupedExport.createDrawingFunc(sigCreditSelector, groupedConfig);
groupedExport.draw(sigCreditSelector);

//Add dropdown event listeners
groupedExport.addDropdownListener(sigCreditSelector);

/*********************** SIG CREDIT TABLE *********************/
// add table to page
tableExport.addTable(sigCreditSelector);

// get data for drawing the table
tableExport.setData(sigCreditSelector, "sig_credit");

// draw the table
tableExport.createDrawingFunc(sigCreditSelector);
tableExport.draw(sigCreditSelector);
tableExport.addDropdownListener(sigCreditSelector);

/************************************************ GROUPED STACK ************************************************/

//set up sizing
var groupedStackMargin = {top: 40, right: 40, bottom: 40, left: 40};
var groupedStackWidth =400;
var groupedStackHeight =150;
 
//draw svg
var groupedStackSvg = d3.select("#groupedStack .groupedStack") 
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("class", "svg-content-responsive")
//  .attr("width", "100vw")
//  .attr("height", "100vh")
  //.attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox", -groupedStackMargin.left + " " + -groupedStackMargin.right + " "+ groupedStackWidth + " " + groupedStackHeight)
;

//setup config objects
var groupedStackClassMapFunction = function (d){
  return classMap[ d.key ];
}

var groupedStackClassMap =  {"pin_debit": "fill-blue", "sig_credit": "fill-red",
"sig_debit": "fill-gray-light", "Fast Food": "fill-orange-yellow",
"Pharmacies": "fill-teal", "All Others": "fill-gray-dark" };

//create test data
var groupedStackData = [ {key: "fiName"}, { key: "fiName2"}, { key: "fiName3"}, { key: "fiName4"}, { key: "fiName5"}, { key: "fiName6"}];

groupedStackData[0].groups = [{
  "sig_debit" : 0.25,
  "sig_credit" : 0.25,
  "pin_debit" : 0.5,
  total: 1
}];
groupedStackData[0].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]

groupedStackData[1].groups = [ {
  "sig_debit" : 0.25,
  "sig_credit" : 0.25,
  "pin_debit" : 0.50,
  total: 1
}]
groupedStackData[1].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]

groupedStackData[2].groups = [ {
  "sig_debit" : 0.25,
  "sig_credit" : 0.25,
  "pin_debit" : 0.50,
  total: 1
}]
groupedStackData[2].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]

groupedStackData[3].groups = [ {
  "sig_debit" : 0.25,
  "sig_credit" : 0.25,
  "pin_debit" : 0.50,
  total: 1
}]
groupedStackData[3].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]

groupedStackData[4].groups = [ {
  "sig_debit" : 0.25,
  "sig_credit" : 0.25,
  "pin_debit" : 0.50,
  total: 1
}]
groupedStackData[4].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]

groupedStackData[5].groups = [ {
  "sig_debit" : 0.25,
  "sig_credit" : 0.25,
  "pin_debit" : 0.50,
  total: 1
}]
groupedStackData[5].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]

//config chart
var testStacks = stacksChart()
  .margin( groupedStackMargin)
  .width(groupedStackWidth )
  .height(groupedStackHeight )
;

//draw chart
testStacks(groupedStackSvg, groupedStackData);

//groupedStackFilter(groupedStackData, ["sig_debit", "sig_credit"]);
//console.log(groupedStackData);

//testStacks(groupedStackSvg, groupedStackData);

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
