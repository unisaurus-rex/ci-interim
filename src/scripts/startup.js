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
import {groupStackedExport} from 'groupStackedController';
import {tableExport, testing} from 'tableController';
import {toolTips} from 'tooltips';
import {stacksChart} from 'groupedStack';
import {getInsightsData, getFiName} from 'model';

/***************************** Page Loading ************************************/
d3.select(".loader").transition().duration(4000)
  .style("opacity", "0").remove();

//change company name
function updateCompanyName(getFiName){
  var sel = d3.select("#navbar li");
  sel.style("opacity", "0");

  sel._groups[0][0].innerHTML = 
    "<a>" + getFiName() + " |" + "<strong> 2017 </string> </a>"; 
  sel.transition().duration(1000).style("opacity", "1")
}

updateCompanyName( getFiName );
 
//Tooltips
toolTips();

/************************************************ ALL GROUPED BAR CHARTS ************************************************/

//set up SVG and margins
var groupedSvgSize = {width: 400, height: 150};
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

//Setup checkboxes
var sigDebitGroupedIds = ['groupedCbox1', 'groupedCbox2', 'groupedCbox3', 'groupedCbox4', 'groupedCbox5', "groupedCbox6"];

groupedExport.addGraph(sigDebitSelector, groupedSvgSize, groupedMargin, "sig_debit", groupedConfig);

/*********************** SIG DEBIT TABLE *********************/
// add table to page
tableExport.addTable(sigDebitSelector, "sig_debit");


/************************************************ PIN DEBIT ************************************************/

/*********************** PIN DEBIT GROUPED BAR *********************/
var pinDebitSelector =  "#pinDebitGrouped";

//Setup checkboxes
var pinDebitGroupedIds = ['groupedCbox7', 'groupedCbox8', 'groupedCbox9', 'groupedCbox10', 'groupedCbox11', "groupedCbox12"];

groupedExport.addGraph(pinDebitSelector, groupedSvgSize, groupedMargin, "pin_debit", groupedConfig);

/*********************** PIN DEBIT TABLE *********************/
// add table to page
tableExport.addTable(pinDebitSelector, "pin_debit");

/************************************************ SIG CREDIT ************************************************/

/*********************** SIG CREDIT GROUPED BAR *********************/
var sigCreditSelector =  "#sigCreditGrouped";
//Setup checkboxes
var sigCreditGroupedIds = ['groupedCbox13', 'groupedCbox14', 'groupedCbox15', 'groupedCbox16', 'groupedCbox17', "groupedCbox18"];

groupedExport.addGraph(sigCreditSelector, groupedSvgSize, groupedMargin, "sig_credit", groupedConfig);

/*********************** SIG CREDIT TABLE *********************/
// add table to page
tableExport.addTable(sigCreditSelector, "sig_credit");

/************************************************ GROUPED STACK ************************************************/

//set up sizing
var groupedStackMargin = {top: 40, right: 40, bottom: 40, left: 40};
var groupedStackWidth =400;
var groupedStackHeight =150;

var groupedStackSelector =  "#groupedStack";

groupStackedExport.setSvgSize(groupedStackSelector, groupedStackWidth, groupedStackHeight);

groupStackedExport.setMargins(groupedStackSelector, groupedStackMargin);
groupStackedExport.drawSvg(groupedStackSelector);

groupStackedExport.buildData(groupedStackSelector);

//Setup checkboxes
var groupStackedIds = ['groupedCbox19', 'groupedCbox20', 'groupedCbox21'];

var groupStackedVals = ['pin_debit', 'sig_credit', 'sig_debit' ];
var groupStackedDefaults = [true, true, true];

var groupStackedCb = groupStackedExport.observerCallbackBuilder(groupedStackSelector);
groupStackedExport.initObservers(groupedStackSelector, groupStackedIds, groupStackedVals, groupStackedDefaults, groupStackedCb);
 
groupStackedExport.createDrawingFunc(groupedStackSelector);
groupStackedExport.draw(groupedStackSelector);

groupStackedExport.addDropdownListener(groupedStackSelector);
//draw svg
//var groupedStackSvg = d3.select("#groupedStack .groupedStack") 
//  .append("div")
//  .classed("svg-container", true)
//  .append("svg")
//  .attr("class", "svg-content-responsive")
////  .attr("width", "100vw")
////  .attr("height", "100vh")
//  //.attr("preserveAspectRatio", "xMinYMin meet")     
//  .attr("viewBox", -groupedStackMargin.left + " " + -groupedStackMargin.right + " "+ groupedStackWidth + " " + groupedStackHeight)
//;

//var groupedStackData = [ {key: "fiName"}, { key: "fiName2"}, { key: "fiName3"}, { key: "fiName4"}, { key: "fiName5"}, { key: "fiName6"}];
//
//groupedStackData[0].groups = [{
//  "sig_debit" : 0.25,
//  "sig_credit" : 0.25,
//  "pin_debit" : 0.5,
//  total: 1
//}];
//groupedStackData[0].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
//
//groupedStackData[1].groups = [ {
//  "sig_debit" : 0.25,
//  "sig_credit" : 0.25,
//  "pin_debit" : 0.50,
//  total: 1
//}]
//groupedStackData[1].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
//
//groupedStackData[2].groups = [ {
//  "sig_debit" : 0.25,
//  "sig_credit" : 0.25,
//  "pin_debit" : 0.50,
//  total: 1
//}]
//groupedStackData[2].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
//
//groupedStackData[3].groups = [ {
//  "sig_debit" : 0.25,
//  "sig_credit" : 0.25,
//  "pin_debit" : 0.50,
//  total: 1
//}]
//groupedStackData[3].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
//
//groupedStackData[4].groups = [ {
//  "sig_debit" : 0.25,
//  "sig_credit" : 0.25,
//  "pin_debit" : 0.50,
//  total: 1
//}]
//groupedStackData[4].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
//
//groupedStackData[5].groups = [ {
//  "sig_debit" : 0.25,
//  "sig_credit" : 0.25,
//  "pin_debit" : 0.50,
//  total: 1
//}]
//groupedStackData[5].groups.columns = [ "sig_debit", "sig_credit", "pin_debit"]
//
////config chart
//var testStacks = stacksChart()
//  .margin( groupedStackMargin)
//  .width(groupedStackWidth )
//  .height(groupedStackHeight )
//;
//
////draw chart
//testStacks(groupedStackSvg, groupedStackData);

//groupedStackFilter(groupedStackData, ["sig_debit", "sig_credit"]);
//console.log(groupedStackData);

//testStacks(groupedStackSvg, groupedStackData);

/*function groupedStackFilter(data, checked){
//loop through data array
for (var i=0; i< data.length; i++){
//update columns to contain only what was checked
data[i].groups.columns = data[i].groups.columns.filter( 
function(d){ 
if ( checked.indexOf(d) > -1 )
return d;
})
}
}*/
