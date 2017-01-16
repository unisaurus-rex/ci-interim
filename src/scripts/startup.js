/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';
import * as d3 from "d3";

/***** local packages *****/
import {getInsightsData} from 'model';
import Checkboxes from 'checkboxes';
import groupedBarChart from 'groupedBar';
import {groupedExport} from 'groupedBarController';
import {donutExport} from 'donutController';
import donutConfig from "donutConfig";
import groupedBarConfig from "groupedBarConfig";
import {getSpendByMerchantSegmentData, getPurchaseByMerchantSegmentData} from 'stackedController';
import tableChart from 'table';
import donutChart from 'donut';
import stackChart from 'stacked';
import {getData as getTableData} from 'tableController';
import addBootstrapCheckboxObservers from 'checkboxObserver';

/************************************************ ALL CHARTS ************************************************/
var classMap =  {"Department Store": "fill-blue", "Grocery": "fill-red",
                 "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
                 "Pharmacies": "fill-teal", "Total": "fill-gray-dark" };

/* ALL DONUTS AND STACKED CHART CHECKBOXES */
var vals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery" ];
var defaults = [true, true, true, true, true];


/************************************************ Grouped Bar Chart ************************************************/

var groupedWidth = 500;
var groupedHeight = 100;
var groupedName =  "#sigDebitGrouped";
groupedExport.setSvgSize(groupedName, groupedWidth, groupedHeight);

var gBarSvg= groupedExport.drawSvg(groupedName);

var groupedBarData = groupedExport.buildData(groupedName, "sig_debit");

var groupedMargin = {top: 20, right: 20, bottom: 20, left: 20};
groupedExport.setMargins(groupedName, groupedMargin);

// stuff to pass to config
var classMapFunctionBar = function (d){
  return classMap[ d.name ];
}

var formatPercent = function(d){ return d + "%"};
//define function to define range for a group

//create scales
var x0 = d3.scaleBand()
  .rangeRound([0, groupedWidth])
  .domain(groupedBarData.map(function(d) { return d.Issuer; }))
;
var groupRangeFunction = function(d) { return "translate(" + x0(d.Issuer) + ",0)"; };

// used for scales
var jsonGroupNames = groupedBarData.columns;

//// scales
//var x1 = d3.scaleBand()
//  .paddingOuter(1)
//  .domain(jsonGroupNames)
//  .rangeRound([0, x0.bandwidth()])
//; 
//var y = d3.scaleLinear()
//  .range([groupedHeight, 0])
//  .domain([0, d3.max(groupedBarData, function(d) { return d3.max(d.groups, function(d) { return d.value; }); })]);
//;
//
////create axes
//var xAxis = d3.axisBottom()
//    .scale(x0)
//    .tickSize(0)
//    .tickPadding(10)
//;
//var yAxis = d3.axisLeft()
//    .scale(y)
//    .tickFormat(formatPercent)
//    .ticks(5)
//    .tickSizeInner(-groupedWidth)
//    .tickSizeOuter(0)
//    .tickPadding(0)
//;
//
////draw axes
//gBarSvg.append("g")
//  .attr("class", "x axis")
//  .attr("transform", "translate(0," + groupedHeight + ")")
//  .call(xAxis)
//;
//gBarSvg.append("g")
//  .attr("class", "y axis")
//  .call(yAxis)
//;
var groupedConfig = new groupedBarConfig()
    .setClassMap(classMap)
    .setClassMapFunction(classMapFunctionBar)
    .setGroupRangeFunction(groupRangeFunction)
;

var groupedIds = ['groupedCbox1', 'groupedCbox2', 'groupedCbox3', 'groupedCbox4', 'groupedCbox5', "groupedCbox6"];
var groupedVals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery", "Total" ];
var groupedDefaults = [true, true, true, true, true, true];

var groupedCb = groupedExport.observerCallbackBuilder(groupedName);
groupedExport.initObservers(groupedName, groupedIds, groupedVals, groupedDefaults, groupedCb);

groupedExport.createDrawingFunc(groupedName, groupedConfig);
groupedExport.draw(groupedName);
groupedExport.addDropdownListener(groupedName);

/************************************************ TABLE ************************************************/

// add table to page
var table = d3.select("#drawtable")
    .append("table")
    .attr("class", "table");

// table should have a head and body
table.append("thead");
table.append("tbody");

// get data for drawing the table
var tableDataFunc = getTableData();
tableDataFunc.txnType("sig_debit");
var tableData = tableDataFunc('n_trans');

// draw the table
var drawTable = tableChart();
drawTable(table, tableData);

/************************************************ DONUTS ************************************************/

//config objects
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

var donutInterchangeName = "#sigDebitInterchange";
var donutMargin = {top: 20, left: 20, right: 30, bottom: 50};
donutExport.setSvgSize(donutInterchangeName, 500, 500);
donutExport.setMargins(donutInterchangeName ,donutMargin);
donutExport.drawSvg(donutInterchangeName);
donutExport.buildData(donutInterchangeName, "sig_debit", "My Financial Institution");

var interchangeValueFunction = function(d){
  //console.log("return d.avg_fee")
  return d.avg_fee;
}

var interchangeInnerNumber = 0;

var interchangeDonutConfig = new donutConfig().setClassMap(classMap)
  .setValueFunction(interchangeValueFunction)
  .setConstancyFunction(constancyFunction)
  .setClassMapFunction(classMapFunction)
  .setInnerRad(innerRad)
  .setInnerNumber(interchangeInnerNumber)
  .setInnerText("AVG INTERCHANGE")
  .setPadAngle(padAngle)
;

var donutOneCb = donutExport.observerCallbackBuilder(donutInterchangeName);
var idsInterchangeDonut = ['groupedCbox7', 'groupedCbox8', 'groupedCbox9', 'groupedCbox10', 'groupedCbox11'];
donutExport.initObservers(donutInterchangeName, idsInterchangeDonut, vals, defaults, donutOneCb);

donutExport.createDrawingFunc(donutInterchangeName, interchangeDonutConfig);
donutExport.draw(donutInterchangeName);
donutExport.addDropdownListener(donutInterchangeName);



/*
  TODO: inner number set based on data
  donutData.forEach(function(d,j){
  interchangeInnerNumber += d.avg_fee;
  });
  interchangeInnerNumber = interchangeInnerNumber / donutData.length;
*/


/********* Donut 2 (TOTAL SALES) *********/

var donutSalesName = "#sigDebitSales";
donutExport.setSvgSize(donutSalesName, 500, 500);
donutExport.setMargins(donutSalesName ,donutMargin);
donutExport.drawSvg(donutSalesName);
donutExport.buildData(donutSalesName, "sig_debit", "My Financial Institution");

var salesValueFunction = function(d){
  return d.amt_sale;
}

var salesDonutConfig = new donutConfig().setClassMap(classMap)
  .setValueFunction(interchangeValueFunction)
  .setConstancyFunction(constancyFunction)
  .setClassMapFunction(classMapFunction)
  .setInnerRad(innerRad)
  .setInnerNumber(0)
  .setInnerText("TOTAL SALES")
  .setPadAngle(padAngle)
;

var donutTwoCb = donutExport.observerCallbackBuilder(donutSalesName);
var idsSalesDonut = ['groupedCbox12', 'groupedCbox13', 'groupedCbox14', 'groupedCbox15', 'groupedCbox16'];
donutExport.initObservers(donutSalesName, idsSalesDonut, vals, defaults, donutTwoCb);

donutExport.createDrawingFunc(donutSalesName, salesDonutConfig);
donutExport.draw(donutSalesName);
donutExport.addDropdownListener(donutSalesName);

/********* Donut 3 (TOTAL TRANS) *********/


var donutTransactionsName = "#sigDebitTransactions";
donutExport.setSvgSize(donutTransactionsName, 500, 500);
donutExport.setMargins(donutTransactionsName ,donutMargin);
donutExport.drawSvg(donutTransactionsName);
donutExport.buildData(donutTransactionsName, "sig_debit", "My Financial Institution");

var transactionsValueFunction = function(d){
  return d.amt_sale;
}

var transactionsDonutConfig = new donutConfig().setClassMap(classMap)
  .setValueFunction(transactionsValueFunction)
  .setConstancyFunction(constancyFunction)
  .setClassMapFunction(classMapFunction)
  .setInnerRad(innerRad)
  .setInnerNumber(0)
  .setInnerText("TOTAL TRANS")
  .setPadAngle(padAngle)
;

var donutThreeCb = donutExport.observerCallbackBuilder(donutTransactionsName);
var idsTransactionsDonut = ['groupedCbox17', 'groupedCbox18', 'groupedCbox19', 'groupedCbox20', 'groupedCbox21'];
donutExport.initObservers(donutTransactionsName, idsTransactionsDonut, vals, defaults, donutThreeCb);

donutExport.createDrawingFunc(donutTransactionsName, transactionsDonutConfig);
donutExport.draw(donutTransactionsName);
donutExport.addDropdownListener(donutTransactionsName);


/************************************************ Stacked Charts ************************************************/

/****************** GET SPEND BY MERCHANGE SEGMENT DATA STACK ******************/

var getSpendData = getSpendByMerchantSegmentData();

var spendData = getSpendData();

//add columns attribute
spendData.columns = Object.keys(spendData[0]).filter(function (obj){
  return obj != "total";
})

  
var svgSpendStack = d3.select("#spendStack")  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + 900 + " " + 300)
;

var stackedClassMapFunction = function (d){
    return classMap[ d.key ];
  }



var stackedMargin = {top: 30, right: 40, bottom: 50, left: 40};
var stackedWidth =900;
var stackedHeight =300;

var drawStack = stackChart()
  .margin(stackedMargin)
  .width(stackedWidth)
  .height(stackedHeight)
  .classMap(classMap)
  .classMapFunction(stackedClassMapFunction)
;

drawStack(svgSpendStack, spendData);
/********* GET SPEND BY MERCHANT DATA CHECKBOXES *********/

// add observers
var idsSpendStack = ['groupedCbox22', 'groupedCbox23', 'groupedCbox24', 'groupedCbox25', 'groupedCbox26'];

// function to execute when a change happens
var cbackSpendStack = (arr) => {

  var filteredSpendData = [];
  var SpendStackObj = {};
  filteredSpendData[0] = SpendStackObj;
  //filter data
  for (var i =0; i< arr.length; i++){
    filteredSpendData[0] [ arr[i] ] = spendData[0] [ arr[i] ];
  }
  filteredSpendData[0].total = 1;

  filteredSpendData.columns = Object.keys(filteredSpendData[0]).filter(function (obj){
    return obj != "total";
  })

  //redraw stack
  drawStack (svgSpendStack, filteredSpendData);
};

//config checkboxes
var observersFuncSpendStack = addBootstrapCheckboxObservers().elementIds(idsSpendStack)
    .values(vals)
    .defaults(defaults)
    .callback(cbackSpendStack);

observersFuncSpendStack();

/****************** GET PURCHASE BY MERCHANGE SEGMENT DATA STACK ******************/

var getPurchaseData = getPurchaseByMerchantSegmentData();

var purchaseData = getPurchaseData();

//add columns attribute
purchaseData.columns = Object.keys(purchaseData[0]).filter(function (obj){
  return obj != "total";
})

//add columns attribute
purchaseData.columns = Object.keys(purchaseData[0]).filter(function (obj){
  return obj != "total";
})

var svgPurchaseStack = d3.select("#purchaseStack")  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + 900 + " " + 300)
;

drawStack(svgPurchaseStack, purchaseData);

/********* GET PURCHASE BY MERCHANT SEGMENT CHECKBOXES *********/

// add observers
var idsPurchaseStack = ['groupedCbox27', 'groupedCbox28', 'groupedCbox29', 'groupedCbox30', 'groupedCbox31'];

// function to execute when a change happens
var cbackPurchaseStack = (arr) => {

  var filteredPurchaseStackData = [];
  var PurchaseStackObj = {};
  filteredPurchaseStackData[0] = PurchaseStackObj;
  //filter data
  for (var i =0; i< arr.length; i++){
    filteredPurchaseStackData[0] [ arr[i] ] = purchaseData[0] [ arr[i] ];
  }
  filteredPurchaseStackData[0].total = 1;

  filteredPurchaseStackData.columns = Object.keys(filteredPurchaseStackData[0]).filter(function (obj){
    return obj != "total";
  })

  //redraw stack
  drawStack (svgPurchaseStack, filteredPurchaseStackData);
};

//config checkboxes
var observersFuncPurchaseStack = addBootstrapCheckboxObservers().elementIds(idsPurchaseStack)
    .values(vals)
    .defaults(defaults)
    .callback(cbackPurchaseStack);

observersFuncPurchaseStack();
