/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';
import * as d3 from "d3";

/***** local packages *****/
import {groupedExport} from 'groupedBarController';
import groupedBarConfig from "groupedBarConfig";
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

  let titleHtml = "<a>" + getFiName() + " |" + "<strong> 2017 </strong> </a>"; 
  sel.html(titleHtml);
  sel.transition().duration(1000).style("opacity", "1");
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
var groupedStackSelector =  "#groupStack";

groupStackExport.addGroupStack(groupedStackSelector, groupedStackWidth, groupedStackHeight, groupedStackMargin);
