/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';
import * as d3 from "d3";

/***** local packages *****/
import {getInsightsData} from 'model';
import Checkboxes from 'checkboxes';
import groupedBarChart from 'groupedBar';
import groupedBarController from 'groupedBarController';
import donutController from 'donutController';
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

//get data from controller
var getGroupedBarData = groupedBarController()
  .txnType("sig_debit")
;
var groupedBarData = getGroupedBarData();

//chart parameters
var groupedWidth = 500;
var groupedHeight = 100;
var groupedMargin = {top: 20, right: 20, bottom: 0, left: 0};
groupedWidth = groupedWidth - groupedMargin.right - groupedMargin.left;
groupedHeight = groupedHeight - groupedMargin.top - groupedMargin.bottom;

//create svg
var gBarSvg = d3.select("div#groupedBarSigDebit")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + groupedWidth + " " + groupedHeight)
  .style("overflow", "visible")
  //class to make it responsive
  .classed("svg-content-responsive", true)
;

// stuff to pass to config
var classMapFunctionBar = function (d){
  return classMap[ d.name ];
}

// Axes
//formatting for y axis
var formatPercent = function(d){ return d + "%"};
//define function to define range for a group
var groupRangeFunction = function(d) {return "translate(" + x0(d.Issuer) + ",0)"; };


//create scales
var x0 = d3.scaleBand()
  .rangeRound([0, groupedWidth])
  .domain(groupedBarData.map(function(d) { return d.Issuer; }))
;

// used for scales
var jsonGroupNames = groupedBarData.columns;

// scales
var x1 = d3.scaleBand()
  .paddingOuter(1)
  .domain(jsonGroupNames)
  .rangeRound([0, x0.bandwidth()])
; 
var y = d3.scaleLinear()
  .range([groupedHeight, 0])
  .domain([0, d3.max(groupedBarData, function(d) { return d3.max(d.groups, function(d) { return d.value; }); })]);
;

//create axes
var xAxis = d3.axisBottom()
    .scale(x0)
    .tickSize(0)
    .tickPadding(10)
;
var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(formatPercent)
    .ticks(5)
    .tickSizeInner(-groupedWidth)
    .tickSizeOuter(0)
    .tickPadding(0)
;
  
//draw axes
gBarSvg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + groupedHeight + ")")
  .call(xAxis)
;
gBarSvg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
;

//chart config
var test = groupedBarChart()
    .width(groupedWidth)
    .height(groupedHeight)
    .classMap(classMap)
    .classMapFunction(classMapFunctionBar)
    .x0( x0 )
    .x1( x1 )
    .y( y )
    .groupRangeFunction(groupRangeFunction)
;

//draw chart
test(gBarSvg, groupedBarData);


/******* GROUPED BAR CHECKBOXES *******/

// add observers
var groupedIds = ['groupedCbox1', 'groupedCbox2', 'groupedCbox3', 'groupedCbox4', 'groupedCbox5', "groupedCbox6"];

var groupedVals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery", "Total" ];
var groupedDefaults = [true, true, true, true, true, true];

// function to execute when a change happens
var groupedCback = (arr) => {
  //add issuer to object
  arr.push( "Issuer" );

  //filter data
  var filteredData = groupedBarData.map( (d) => {
    return arr.reduce( (result, key) => {result[key] = d[key];
                                         return result;}, {});
  });  

  //add group attribute
  var jsonGroupNames = d3.keys(filteredData[0]).filter(function(key) { return key !== "Issuer"; });
  filteredData.forEach(function(d) {
    d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  //redraw chart
  test (gBarSvg, filteredData);
};

//config
var groupedObserversFunc = addBootstrapCheckboxObservers().elementIds(groupedIds)
    .values(groupedVals)
    .defaults(groupedDefaults)
    .callback(groupedCback);

groupedObserversFunc();

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


/********** USED FOR ALL DONUTS **********/
//get data from controller
var getDonutData = donutController()
    .txnType("sig_debit")
    .fi("My Financial Institution")
;
var donutData = getDonutData();

//config objects
var constancyFunction = function(d){
  return d.mcc_name;
}
var classMapFunction = function(d){
  return classMap[d.data.mcc_name];
}

var donutWidth = 500;
var donutHeight = 500;
var innerRad = 90;
var padAngle = 0.03;

/********* Donut 1 (AVG INTERCHANGE) *********/
//draw svg

var interchangeDonutSvg = d3.select("div#interchangeFeesDonut")
    .classed("svg-container", true)
    .append("svg")
    .attr("viewBox", "0 0 " + donutWidth + " " + donutHeight)
//class for responsivenesss
    .classed("svg-content-responsive-pie", true)
    .attr("width", donutWidth)
    .attr("height", donutHeight)
    .append("g")
    .attr("id", "donutchart")
    .attr("transform", "translate(" + donutWidth / 2 + "," + donutHeight / 2 + ")")
;

var interchangeValueFunction = function(d){
  return d.avg_fee;
}

var interchangeInnerNumber = 0;
donutData.forEach(function(d,j){
  interchangeInnerNumber += d.avg_fee;
});
interchangeInnerNumber = interchangeInnerNumber / donutData.length;

//config donut
var drawDonut = donutChart()
  .classMap(classMap)
  .valueFunction(interchangeValueFunction)
  .constancyFunction(constancyFunction)
  .classMapFunction(classMapFunction)
  .innerRad(innerRad)
  .innerNumber(interchangeInnerNumber)
  .innerText("AVG INTERCHANGE")
  .padAngle(padAngle)
;

//draw donut
drawDonut(interchangeDonutSvg, donutData);

/********* DONUT 1 CHECKBOXES *********/

// add observers
var idsInterchangeDonut = ['groupedCbox7', 'groupedCbox8', 'groupedCbox9', 'groupedCbox10', 'groupedCbox11'];


// function to execute when a change happens
var cbackInterchangeDonut = (arr) => {

  //filter data
  var filteredInterchangeDonut = donutData.filter(function (obj){
    if (arr.indexOf(obj.mcc_name) == -1) {
      return false;
    }
    return true;
  })

  //update inner number
  interchangeInnerNumber = 0;
  filteredInterchangeDonut.forEach(function(d,j){
    interchangeInnerNumber += d.avg_fee;
  });
  interchangeInnerNumber = interchangeInnerNumber / filteredInterchangeDonut.length;
  if (!interchangeInnerNumber || interchangeInnerNumber == NaN){ interchangeInnerNumber = 0;}
  drawDonut.innerNumber(interchangeInnerNumber).innerText("AVG INTERCHANGE");

  //redraw donut
  drawDonut (interchangeDonutSvg, filteredInterchangeDonut);
};

//config checkboxes
var observersFuncInterchangeDonut = addBootstrapCheckboxObservers().elementIds(idsInterchangeDonut)
    .values(vals)
    .defaults(defaults)
    .callback(cbackInterchangeDonut);

observersFuncInterchangeDonut();

/********* Donut 2 (TOTAL SALES) *********/

//draw svg
var salesDonutSvg = d3.select("div#salesDonut")
  .classed("svg-container", true)
  .append("svg")
  .attr("viewBox", "0 0 " + donutWidth + " " + donutHeight)
  //class for responsivenesss
  .classed("svg-content-responsive-pie", true)
  .attr("width", donutWidth)
  .attr("height", donutHeight)
  .append("g")
  .attr("id", "donutchart")
  .attr("transform", "translate(" + donutWidth / 2 + "," + donutHeight / 2 + ")")
;

var salesValueFunction = function(d){
  return d.amt_sale;
}

var salesInnerNumber = 0;
donutData.forEach(function(d,j){
  salesInnerNumber += d.amt_sale;
});

//config
drawDonut
  .valueFunction(salesValueFunction)
  .innerNumber(salesInnerNumber)
  .innerText("TOTAL SALES")
;

//draw donut
drawDonut(salesDonutSvg, donutData)

/********* DONUT 2 CHECKBOXES *********/

// add observers
var idsSalesDonut = ['groupedCbox12', 'groupedCbox13', 'groupedCbox14', 'groupedCbox15', 'groupedCbox16'];

// function to execute when a change happens
var cbackSalesDonut = (arr) => {

  var filteredSalesDonut = donutData.filter(function (obj){
    if (arr.indexOf(obj.mcc_name) == -1) {
      return false;
    }
    return true;
    })

  //update inner number
  salesInnerNumber = 0;
  filteredSalesDonut.forEach(function(d,j){
    salesInnerNumber += d.amt_sale;
  });
  drawDonut.innerNumber(salesInnerNumber).innerText("TOTAL SALES");

  //redraw donut
  drawDonut (salesDonutSvg, filteredSalesDonut);
};

//config checkboxes
var observersFuncSalesDonut = addBootstrapCheckboxObservers().elementIds(idsSalesDonut)
    .values(vals)
    .defaults(defaults)
    .callback(cbackSalesDonut);

observersFuncSalesDonut();



/********* Donut 3 (TOTAL TRANS) *********/
//draw svg
var transactionsDonutSvg = d3.select("div#donutTransactions")
  .classed("svg-container", true)
  .append("svg")
  .attr("viewBox", "0 0 " + donutWidth + " " + donutHeight)
  //class for responsivenesss
  .classed("svg-content-responsive-pie", true)
  .attr("width", donutWidth)
  .attr("height", donutHeight)
  .append("g")
  .attr("id", "donutchart")
  .attr("transform", "translate(" + donutWidth / 2 + "," + donutHeight / 2 + ")")
;

var transactionsValueFunction = function(d){
  return d.n_trans;
}

var transactionsInnerNumber = 0;
donutData.forEach(function(d,j){
  transactionsInnerNumber += d.n_trans;
});

//config
drawDonut
  .valueFunction(transactionsValueFunction)
  .innerNumber(transactionsInnerNumber)
  .innerText("TOTAL TRANS")
;

//draw donut
drawDonut(transactionsDonutSvg, donutData)

/********* DONUT 3 CHECKBOXES *********/

// add observers
var idsTransactionDonut = ['groupedCbox17', 'groupedCbox18', 'groupedCbox19', 'groupedCbox20', 'groupedCbox21'];

// function to execute when a change happens
var cbackTransactionDonut = (arr) => {

  //filter data
  var filteredTransactionDonut = donutData.filter(function (obj){
    if (arr.indexOf(obj.mcc_name) == -1) {
      return false;
    }
    return true;
    })

  //update inner number
  transactionsInnerNumber = 0;
  filteredTransactionDonut.forEach(function(d,j){
    transactionsInnerNumber += d.n_trans;
  });
  drawDonut.innerNumber(transactionsInnerNumber).innerText("TOTAL TRANS");

  //redraw donut
  drawDonut (transactionsDonutSvg, filteredTransactionDonut);
};

//config checkboxes
var observersFuncTransactionDonut = addBootstrapCheckboxObservers().elementIds(idsTransactionDonut)
    .values(vals)
    .defaults(defaults)
    .callback(cbackTransactionDonut);

observersFuncTransactionDonut();


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
