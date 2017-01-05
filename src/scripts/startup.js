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

/************************************************ Grouped Bar Chart ************************************************/

//get data from controller
var getData = groupedBarController()
  .txnType("pin_debit")
;
var groupedBarData = getData();

//chart parameters
var width = 500;
var height = 100;
var margin = {top: 20, right: 20, bottom: 0, left: 0};
width = width - margin.right - margin.left;
height = height - margin.top - margin.bottom;

//create svg
var gBarSvg = d3.select("div#chartid")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + width + " " + height)
  //class to make it responsive
  .classed("svg-content-responsive", true)
;

// stuff to pass to config
var classMapFunctionBar = function (d){
  return classMapBar[ d.name ];
}

var classMapBar =  {"Department Store": "fill-blue", "Grocery": "fill-red",
"Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
"Pharmacies": "fill-teal", "Total": "fill-gray-dark" };

// Axes
//formatting for y axis
var formatPercent = function(d){ return d + "%"};
//define function to define range for a group
var groupRangeFunction = function(d) {return "translate(" + x0(d.Issuer) + ",0)"; };


//create scales
var x0 = d3.scaleBand()
  .rangeRound([0, width])
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
  .range([height, 0])
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
    .tickSizeInner(-width)
    .tickSizeOuter(0)
    .tickPadding(0)
;
  
//draw axes
gBarSvg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
;
gBarSvg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
//.append("text")
//.attr("transform", "rotate(-90)")
//.attr("y", 6)
//.attr("dy", ".71em")
//.style("text-anchor", "end")
//.text("percentage")
;

//chart config
var test = groupedBarChart()
    .width(width)
    .height(height)
    .classMap(classMapBar)
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
var ids = ['groupedCbox1', 'groupedCbox2', 'groupedCbox3', 'groupedCbox4', 'groupedCbox5', "groupedCbox6"];
var vals = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Total", "Grocery" ];
var defaults = [true, true, true, true, true, true];

// function to execute when a change happens
var cback = (arr) => {
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
var observersFunc = addBootstrapCheckboxObservers().elementIds(ids)
    .values(vals)
    .defaults(defaults)
    .callback(cback);

observersFunc();

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
    .txnType("pin_debit")
    .fi("My Financial Institution")
;
var myFinancialInstitution = getDonutData();

//config objects
var constancyFunction = function(d){
  return d.mcc_name;
}
var classMapFunction = function(d){
  return classMap[d.data.mcc_name];
}
var classMap = {"Department Store": "fill-blue", "Grocery": "fill-red",
 "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
  "Pharmacies": "fill-teal"};


/********* Donut 1 (AVG INTERCHANGE) *********/
//draw svg

var svg = d3.select("div#donutid")
    .classed("svg-container", true)
    .append("svg")
    .attr("viewBox", "0 0 " + 500 + " " + 500)
//class for responsivenesss
    .classed("svg-content-responsive-pie", true)
    .attr("width", 500)
    .attr("height", 500)
    .append("g")
    .attr("id", "donutchart")
    .attr("transform", "translate(" + 500 / 2 + "," + 500 / 2 + ")")
;

var valueFunction = function(d){
  return d.avg_fee;
}

var innerNumber = 0;
myFinancialInstitution.forEach(function(d,j){
  innerNumber += d.avg_fee;
});
innerNumber = innerNumber / myFinancialInstitution.length;

//config donut
var testDonut = donutChart()
  .classMap(classMap)
  .valueFunction(valueFunction)
  .constancyFunction(constancyFunction)
  .classMapFunction(classMapFunction)
  .innerRad(90)
  .innerNumber(innerNumber)
  .innerText("AVG INTERCHANGE")
  .padAngle(0.03)
;

//draw donut
testDonut(svg, myFinancialInstitution);

/********* DONUT 1 CHECKBOXES *********/

// add observers
var idsDonutOne = ['groupedCbox7', 'groupedCbox8', 'groupedCbox9', 'groupedCbox10', 'groupedCbox11'];
var valsDonutOne = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery" ];
var defaultsDonutOne = [true, true, true, true, true];

// function to execute when a change happens
var cbackDonutOne = (arr) => {

  //filter data
  var filteredDonutOne = myFinancialInstitution.filter(function (obj){
    if (arr.indexOf(obj.mcc_name) == -1) {
      return false;
    }
    return true;
  })

  //update inner number
  innerNumber = 0;
  filteredDonutOne.forEach(function(d,j){
    innerNumber += d.avg_fee;
  });
  innerNumber = innerNumber / filteredDonutOne.length;
  if (!innerNumber || innerNumber == NaN){ innerNumber = 0;}
  testDonut.innerNumber(innerNumber);

  //redraw donut
  testDonut (svg, filteredDonutOne);
};

//config checkboxes
var observersFuncDonutOne = addBootstrapCheckboxObservers().elementIds(idsDonutOne)
    .values(valsDonutOne)
    .defaults(defaultsDonutOne)
    .callback(cbackDonutOne);

observersFuncDonutOne();

/********* Donut 2 (TOTAL SALES) *********/

//draw svg
var svgTwo = d3.select("div#donuttwo")
  .classed("svg-container", true)
  .append("svg")
  .attr("viewBox", "0 0 " + 500 + " " + 500)
  //class for responsivenesss
  .classed("svg-content-responsive-pie", true)
  .attr("width", 500)
  .attr("height", 500)
  .append("g")
  .attr("id", "donutchart")
  .attr("transform", "translate(" + 500 / 2 + "," + 500 / 2 + ")")
;

var valueFunctionTwo = function(d){
  return d.amt_sale;
}

var innerNumberTwo = 0;
myFinancialInstitution.forEach(function(d,j){
  innerNumberTwo += d.amt_sale;
});

//config
var testTwo = donutChart()
  .classMap(classMap)
  .valueFunction(valueFunctionTwo)
  .constancyFunction(constancyFunction)
  .classMapFunction(classMapFunction)
  .innerRad(90)
  .innerNumber(innerNumberTwo)
  .innerText("TOTAL SALES")
  .padAngle(0.03)
;

//draw donut
testTwo(svgTwo, myFinancialInstitution)

/********* DONUT 2 CHECKBOXES *********/

// add observers
var idsDonutTwo = ['groupedCbox12', 'groupedCbox13', 'groupedCbox14', 'groupedCbox15', 'groupedCbox16'];

var valsDonutTwo = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery" ];
var defaultsDonutTwo = [true, true, true, true, true];

// function to execute when a change happens
var cbackDonutTwo = (arr) => {

  var filteredDonutTwo = myFinancialInstitution.filter(function (obj){
    if (arr.indexOf(obj.mcc_name) == -1) {
      return false;
    }
    return true;
    })

  //update inner number
  innerNumberTwo = 0;
  filteredDonutTwo.forEach(function(d,j){
    innerNumberTwo += d.amt_sale;
  });
  testTwo.innerNumber(innerNumberTwo);

  //redraw donut
  testTwo (svgTwo, filteredDonutTwo);
};

//config checkboxes
var observersFuncDonutTwo = addBootstrapCheckboxObservers().elementIds(idsDonutTwo)
    .values(valsDonutTwo)
    .defaults(defaultsDonutTwo)
    .callback(cbackDonutTwo);

observersFuncDonutTwo();



/********* Donut 3 (TOTAL TRANS) *********/
//draw svg
var svgThree = d3.select("div#donutthree")
  .classed("svg-container", true)
  .append("svg")
  .attr("viewBox", "0 0 " + 500 + " " + 500)
  //class for responsivenesss
  .classed("svg-content-responsive-pie", true)
  .attr("width", 500)
  .attr("height", 500)
  .append("g")
  .attr("id", "donutchart")
  .attr("transform", "translate(" + 500 / 2 + "," + 500 / 2 + ")")
;

var valueFunctionThree = function(d){
  return d.n_trans;
}

var innerNumberThree = 0;
myFinancialInstitution.forEach(function(d,j){
  innerNumberThree += d.n_trans;
});

//config
var testThree = donutChart()
  .classMap(classMap)
  .valueFunction(valueFunctionThree)
  .constancyFunction(constancyFunction)
  .classMapFunction(classMapFunction)
  .innerRad(90)
  .innerNumber(innerNumberThree)
  .innerText("TOTAL TRANS")
  .padAngle(0.03)
;

//draw donut
testThree(svgThree, myFinancialInstitution)

/********* DONUT 3 CHECKBOXES *********/

// add observers
var idsDonutThree = ['groupedCbox17', 'groupedCbox18', 'groupedCbox19', 'groupedCbox20', 'groupedCbox21'];

var valsDonutThree = ['Department Store', 'Pharmacies', 'Family Clothing', 'Fast Food', "Grocery" ];
var defaultsDonutThree = [true, true, true, true, true];

// function to execute when a change happens
var cbackDonutThree = (arr) => {

  //filter data
  var filteredDonutThree = myFinancialInstitution.filter(function (obj){
    if (arr.indexOf(obj.mcc_name) == -1) {
      return false;
    }
    return true;
    })

  //update inner number
  innerNumberThree = 0;
  filteredDonutThree.forEach(function(d,j){
    innerNumberThree += d.n_trans;
  });
  testThree.innerNumber(innerNumberThree);

  //redraw donut
  testThree (svgThree, filteredDonutThree);
};

//config checkboxes
var observersFuncDonutThree = addBootstrapCheckboxObservers().elementIds(idsDonutThree)
    .values(valsDonutThree)
    .defaults(defaultsDonutThree)
    .callback(cbackDonutThree);

observersFuncDonutThree();


/************************************************ Stacked Chart ************************************************/

/****************** GET SPEND BY MERCHANGE SEGMENT DATA STACK ******************/

var getStackedData = getSpendByMerchantSegmentData();

var stackedDataTest = getStackedData();

//add columns attribute
stackedDataTest.columns = Object.keys(stackedDataTest[0]).filter(function (obj){
  return obj != "total";
})

  
var svgStacked = d3.select("#stackid")  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + 900 + " " + 300)
;

var stackedClassMapFunction = function (d){
    return stackedClassMap[ d.key ];
  }

var stackedClassMap =  {"Department Store": "fill-blue", "Grocery": "fill-red",
  "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
  "Pharmacies": "fill-teal", "All Others": "fill-gray-dark" };



var stackedMargin = {top: 30, right: 40, bottom: 50, left: 40};
var stackedWidth =900;
var stackedHeight =300;

var testStack = stackChart()
  .margin(stackedMargin)
  .width(stackedWidth)
  .height(stackedHeight)
  .classMap(stackedClassMap)
  .classMapFunction(stackedClassMapFunction)
;

testStack(svgStacked, stackedDataTest);

/*window.stackedData = stackedData;
window.stackedDataTest = stackedDataTest;
window.testStack = testStack;
window.svgStacked = svgStacked;*/



/****************** GET PURCHASE BY MERCHANGE SEGMENT DATA STACK ******************/

var getStackedDataTwo = getPurchaseByMerchantSegmentData();

var stackedDataTwo = getStackedDataTwo();

//add columns attribute
stackedDataTwo.columns = Object.keys(stackedDataTwo[0]).filter(function (obj){
  return obj != "total";
})

//add columns attribute
stackedDataTwo.columns = Object.keys(stackedDataTwo[0]).filter(function (obj){
  return obj != "total";
})

var svgStackedTwo = d3.select("#purchasestack")  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + 900 + " " + 300)
;

testStack(svgStackedTwo, stackedDataTwo);