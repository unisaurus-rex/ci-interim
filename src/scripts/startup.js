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

//Tooltips
toolTips();

/************************************************ ALL GROUPED BAR CHARTS ************************************************/

//set up SVG and margins
var groupedWidth = 500;
var groupedHeight = 100;
var groupedMargin = {top: 20, right: 20, bottom: 20, left: 20};

var classMap =  {"Department Store": "fill-blue", "Grocery": "fill-red",
                 "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
                 "Pharmacies": "fill-teal", "Total": "fill-gray-dark" };

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
var groupedVals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery", "Total" ];
var groupedDefaults = [true, true, true, true, true, true];

/***********************************************************************************************************************/


/************************************************ Grouped Bar Sig Debit ************************************************/
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

/************************************************ SIG DEBIT TABLE ************************************************/

// add table to page
tableExport.addTable(sigDebitSelector);

// get data for drawing the table
tableExport.setData(sigDebitSelector, "sig_debit");

// draw the table
tableExport.createDrawingFunc(sigDebitSelector);
tableExport.draw(sigDebitSelector);
tableExport.addDropdownListener(sigDebitSelector);



/************************************************ Grouped Bar Pin Debit ************************************************/
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

/************************************************ PIN DEBIT TABLE ************************************************/

// add table to page
tableExport.addTable(pinDebitSelector);

// get data for drawing the table
tableExport.setData(pinDebitSelector, "pin_debit");

// draw the table
tableExport.createDrawingFunc(pinDebitSelector);
tableExport.draw(pinDebitSelector);
tableExport.addDropdownListener(pinDebitSelector);

/************************************************ Grouped Bar Sig Credit ************************************************/
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

/************************************************ PIN DEBIT TABLE ************************************************/

// add table to page
tableExport.addTable(sigCreditSelector);

// get data for drawing the table
tableExport.setData(sigCreditSelector, "sig_credit");

// draw the table
tableExport.createDrawingFunc(sigCreditSelector);
tableExport.draw(sigCreditSelector);
tableExport.addDropdownListener(sigCreditSelector);