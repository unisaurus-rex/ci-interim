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
import {groupStackExport} from 'groupStackController';
import {tableExport, testing} from 'tableController';
import {toolTips} from 'tooltips';
import {stacksChart} from 'groupStack';
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
tableExport.addTable(sigDebitSelector, "sig_debit");


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
tableExport.addTable(pinDebitSelector, "pin_debit");

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
tableExport.addTable(sigCreditSelector, "sig_credit");

/************************************************ GROUPED STACK ************************************************/

//set up sizing
var groupedStackMargin = {top: 40, right: 40, bottom: 40, left: 40};
var groupedStackWidth =400;
var groupedStackHeight =150;

var groupedStackSelector =  "#groupedStack";
var groupStackedIds = ['groupedCbox19', 'groupedCbox20', 'groupedCbox21'];
groupStackExport.addGroupStack(groupedStackSelector, groupedStackWidth, groupedStackHeight, groupedStackMargin, groupStackedIds);

//done
//groupStackedExport.setSvgSize(groupedStackSelector, groupedStackWidth, groupedStackHeight);
//
//groupStackedExport.setMargins(groupedStackSelector, groupedStackMargin);
//groupStackedExport.drawSvg(groupedStackSelector);
//
//groupStackedExport.buildData(groupedStackSelector);
//


////Setup checkboxes

//
//var groupStackedVals = ['pin_debit', 'sig_credit', 'sig_debit' ];
//var groupStackedDefaults = [true, true, true];
//
//var groupStackedCb = groupStackedExport.observerCallbackBuilder(groupedStackSelector);
//groupStackedExport.initObservers(groupedStackSelector, groupStackedIds, groupStackedVals, groupStackedDefaults, groupStackedCb);
// 

//done
//groupStackedExport.createDrawingFunc(groupedStackSelector);
//groupStackedExport.draw(groupedStackSelector);
//

//groupStackedExport.addDropdownListener(groupedStackSelector);
//
//window.tables = tableExport.tables;
