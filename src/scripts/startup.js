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
import {tableExport} from 'tableController';

import {toolTips} from 'tooltips';

//Tooltips
toolTips();
window.toolTips = toolTips;

/************************************************ ALL CHARTS ************************************************/
var classMap =  {"Department Store": "fill-blue", "Grocery": "fill-red",
                 "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
                 "Pharmacies": "fill-teal", "Total": "fill-gray-dark" };

/* ALL DONUTS AND STACKED CHART CHECKBOXES */
var vals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery" ];
var defaults = [true, true, true, true, true];


/************************************************ Grouped Bar Chart ************************************************/

//set up SVG and margins
var groupedWidth = 500;
var groupedHeight = 100;
var groupedName =  "#sigDebitGrouped";
groupedExport.setSvgSize(groupedName, groupedWidth, groupedHeight);
var groupedMargin = {top: 20, right: 20, bottom: 20, left: 20};
groupedExport.setMargins(groupedName, groupedMargin);
var gBarSvg= groupedExport.drawSvg(groupedName);

//Get data
var groupedBarData = groupedExport.buildData(groupedName, "sig_debit");

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

//Setup checkboxes
var groupedIds = ['groupedCbox1', 'groupedCbox2', 'groupedCbox3', 'groupedCbox4', 'groupedCbox5', "groupedCbox6"];
var groupedVals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery", "Total" ];
var groupedDefaults = [true, true, true, true, true, true];
var groupedCb = groupedExport.observerCallbackBuilder(groupedName);
groupedExport.initObservers(groupedName, groupedIds, groupedVals, groupedDefaults, groupedCb);

//Draw chart
groupedExport.createDrawingFunc(groupedName, groupedConfig);
groupedExport.draw(groupedName);

//Add dropdown event listeners
groupedExport.addDropdownListener(groupedName);

/************************************************ TABLE ************************************************/

//console.log(tableExport);

var sigDebitTableName = "#sigDebitGrouped"; 

// add table to page
tableExport.addTable(sigDebitTableName);

// get data for drawing the table
tableExport.setData(sigDebitTableName, "sig_debit");

// draw the table
tableExport.createDrawingFunc(sigDebitTableName);
tableExport.draw(sigDebitTableName);
tableExport.addDropdownListener(sigDebitTableName);

/************************************************ DONUTS ************************************************/

//ALL DONUTS
var constancyFunction = function(d){
  return d.mcc_name;
}
var classMapFunction = function(d){
  return classMap[d.data.mcc_name];
}

var donutWidth = 500;
var donutHeight = 500;
var innerRad = 75;
var padAngle = 0.03;

/********* Donut 1 (AVG INTERCHANGE) *********/

//Get div id
var donutInterchangeName = "#sigDebitInterchange";

//Setup SVG
var donutMargin = {top: 20, left: 20, right: 30, bottom: 50};
donutExport.setSvgSize(donutInterchangeName, donutWidth, donutHeight);
donutExport.setMargins(donutInterchangeName ,donutMargin);
donutExport.drawSvg(donutInterchangeName);

//Get Data
donutExport.buildData(donutInterchangeName, "sig_debit", "My Financial Institution");

//Setup Config
var interchangeValueFunction = function(d){
  return d.avg_fee;
}
var donutConfiguration = new donutConfig().setClassMap(classMap)
//  .setValueFunction(interchangeValueFunction)
  .setConstancyFunction(constancyFunction)
  .setClassMapFunction(classMapFunction)
  .setInnerRad(innerRad)
  .setPadAngle(padAngle)
;

//Add Checkboxes
var donutOneCb = donutExport.observerCallbackBuilder(donutInterchangeName);
var idsInterchangeDonut = ['groupedCbox7', 'groupedCbox8', 'groupedCbox9', 'groupedCbox10', 'groupedCbox11'];
donutExport.initObservers(donutInterchangeName, idsInterchangeDonut, vals, defaults, donutOneCb);

//Config Draw Function and Chart
donutExport.createDrawingFunc(donutInterchangeName, donutConfiguration);
donutExport.draw(donutInterchangeName);

//Add dropdown event handler
donutExport.addDropdownListener(donutInterchangeName);

/********* Donut 2 (TOTAL SALES) *********/

//Get div id
var donutSalesName = "#sigDebitSales";

//Setup SVG
donutExport.setSvgSize(donutSalesName, donutWidth, donutHeight);
donutExport.setMargins(donutSalesName ,donutMargin);
donutExport.drawSvg(donutSalesName);

//Get Data
donutExport.buildData(donutSalesName, "sig_debit", "My Financial Institution");

//Setup Config
var salesValueFunction = function(d){
  return d.amt_sale;
}

//donutConfiguration.setClassMap(classMap)
//  .setValueFunction(salesValueFunction)
//;

//Add Checkboxes
var donutTwoCb = donutExport.observerCallbackBuilder(donutSalesName);
var idsSalesDonut = ['groupedCbox12', 'groupedCbox13', 'groupedCbox14', 'groupedCbox15', 'groupedCbox16'];
donutExport.initObservers(donutSalesName, idsSalesDonut, vals, defaults, donutTwoCb);

//Config Draw Function and Chart
donutExport.createDrawingFunc(donutSalesName, donutConfiguration);
donutExport.draw(donutSalesName);

//Add dropdown event handler
donutExport.addDropdownListener(donutSalesName);

/********* Donut 3 (TOTAL TRANS) *********/

//Get div id
var donutTransactionsName = "#sigDebitTransactions";

//Setup SVG
donutExport.setSvgSize(donutTransactionsName, donutWidth, donutHeight);
donutExport.setMargins(donutTransactionsName ,donutMargin);
donutExport.drawSvg(donutTransactionsName);
donutExport.buildData(donutTransactionsName, "sig_debit", "My Financial Institution");

//Setup Config
//var transactionsValueFunction = function(d){
//  return d.amt_sale;
//}
//donutConfiguration
//  .setValueFunction(transactionsValueFunction)
//;

//Add checkboxes
var donutThreeCb = donutExport.observerCallbackBuilder(donutTransactionsName);
var idsTransactionsDonut = ['groupedCbox17', 'groupedCbox18', 'groupedCbox19', 'groupedCbox20', 'groupedCbox21'];
donutExport.initObservers(donutTransactionsName, idsTransactionsDonut, vals, defaults, donutThreeCb);

//Config Draw Function and Chart
donutExport.createDrawingFunc(donutTransactionsName, donutConfiguration);
donutExport.draw(donutTransactionsName);

//Add dropdown event handler
donutExport.addDropdownListener(donutTransactionsName);

/************************************************ Stacked Charts ************************************************/

//ALL STACKS
var stackedClassMapFunction = function (d){
  return classMap[ d.key ];
}

var stackConfiguration = new stackConfig()
  .setClassMap(classMap)
  .setClassMapFunction(stackedClassMapFunction)
;

/****************** GET SPEND BY MERCHANGE SEGMENT DATA STACK ******************/

//div name
var spendStackName = "#spendStack";

//setup margins and svg
stackExport.setSvgSize(spendStackName, 900, 300);
var stackedMargin = {top: 30, right: 40, bottom: 50, left: 40};
stackExport.setMargins(spendStackName, stackedMargin);
stackExport.drawSvg(spendStackName);

//get data
stackExport.buildData(spendStackName, "My Financial Institution", "amt_sale");

//set up checkboxes
var spendStackCb = stackExport.observerCallbackBuilder(spendStackName);
var idsSpendStack = ['groupedCbox22', 'groupedCbox23', 'groupedCbox24', 'groupedCbox25', 'groupedCbox26'];
stackExport.initObservers(spendStackName, idsSpendStack, vals, defaults, spendStackCb);

//Config Draw Function and Chart
stackExport.createDrawingFunc(spendStackName, stackConfiguration);
stackExport.draw(spendStackName);

//add dropdown event listener
stackExport.addDropdownListener(spendStackName);


/****************** GET PURCHASE BY MERCHANGE SEGMENT DATA STACK ******************/

//div name
var purchaseStackName = "#purchaseStack";

//setup margins and svg
stackExport.setSvgSize(purchaseStackName, 900, 300);
var stackedMargin = {top: 30, right: 40, bottom: 50, left: 40};
stackExport.setMargins(purchaseStackName, stackedMargin);
stackExport.drawSvg(purchaseStackName);

//get data
stackExport.buildData(purchaseStackName, "My Financial Institution", "n_trans");

//set up checkboxes
var purchaseStackCb = stackExport.observerCallbackBuilder(purchaseStackName);
var idsPurchaseStack = ['groupedCbox27', 'groupedCbox28', 'groupedCbox29', 'groupedCbox30', 'groupedCbox31'];
stackExport.initObservers(purchaseStackName, idsPurchaseStack, vals, defaults, purchaseStackCb);

//Config Draw Function and Chart
stackExport.createDrawingFunc(purchaseStackName, stackConfiguration);
stackExport.draw(purchaseStackName);

//add dropdown event listener
stackExport.addDropdownListener(purchaseStackName);
