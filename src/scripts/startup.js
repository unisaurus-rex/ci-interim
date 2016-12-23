/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';

/***** local packages *****/
import {getInsightsData} from 'model';
import Checkboxes from 'checkboxes';
import groupedBarChart from 'groupedBar';
import tableChart from 'table';
import donutChart from 'donut';
import * as d3 from "d3";

// getInsightsData("sig_credit") will pull all the transacation data for every FI ("
console.log(getInsightsData("sig_credit"));
console.log(getInsightsData("sig_debit", "All Issuers"));



/***************** Grouped Bar Chart ****************/
//chart parameters
var width = 500;
var height = 100;
var margin = {top: 20, right: 20, bottom: 0, left: 0};
width = width - margin.right - margin.left;
height = height - margin.top - margin.bottom;

var svg = d3.select("div#chartid")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")     
  .attr("viewBox","0 0 " + width + " " + height)
  //class to make it responsive
  .classed("svg-content-responsive", true)
;

var classMapFunction = function (d){
  return classMap[ d.name ];
}

var classMap =  {"Department Store": "fill-blue", "Grocery": "fill-red",
"Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
"Pharmacies": "fill-teal", "Total": "fill-gray-dark" };

//formatting for y axis
var formatPercent = d3.format(".1%");

//define function to define range for a group
var groupRangeFunction = function(d) {return "translate(" + x0(d.Issuer) + ",0)"; };
  
var jsonObj = [
  {
    "Issuer": "Issuer 1",
    "Department Store": 0.0175,
    "Pharmacies": 0.0045,
    "Fast Food": 0.0125,
    "Grocery": 0.015,
    "Family Clothing": 0.0175,
    "Total": 0.014
  },
  {
    "Issuer": "Issuer 2",
    "Department Store": 0.004,
    "Pharmacies": 0.006,
    "Fast Food": 0.004,
    "Grocery": 0.003,
    "Family Clothing": 0.0174,
    "Total": 0.016
  },
  {
    "Issuer": "Issuer 3",
    "Department Store": 0.0075,
    "Pharmacies": 0.014,
    "Fast Food": 0.01,
    "Grocery": 0.012,
    "Family Clothing": 0.0025,
    "Total": 0.02
  },
  {
    "Issuer": "Issuer 4",
    "Department Store": 0.0114,
    "Pharmacies": 0.019,
    "Fast Food": 0.015,
    "Grocery": 0.016,
    "Family Clothing": 0.014,
    "Total": 0.019
  },
  {
    "Issuer": "Your Issues",
    "Department Store": 0.008,
    "Pharmacies": 0.02,
    "Fast Food": 0.004,
    "Grocery": 0.0075,
    "Family Clothing": 0.01,
    "Total": 0.015
  },
  {
    "Issuer": "All",
    "Department Store": 0.01,
    "Pharmacies": 0.015,
    "Fast Food": 0.005,
    "Grocery": 0.006,
    "Family Clothing": 0.0025,
    "Total": 0.02
  }
];

var jsonGroupNames = d3.keys(jsonObj[0]).filter(function(key) { return key !== "Issuer"; });

jsonObj.forEach(function(d) {
  d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
});


//create scales
var x0 = d3.scaleBand()
  .rangeRound([0, width])
  .domain(jsonObj.map(function(d) { return d.Issuer; }))
;

var x1 = d3.scaleBand()
  .paddingOuter(1)
  .domain(jsonGroupNames)
  .rangeRound([0, x0.bandwidth()])
; 
var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(jsonObj, function(d) { return d3.max(d.groups, function(d) { return d.value; }); })]);
;

//axes
var xAxis = d3.axisBottom()
  .scale(x0)
  .tickSizeInner(-height)
  .tickSizeOuter(0)
  .tickPadding(10)
;
var yAxis = d3.axisLeft()
  .scale(y)
  .tickFormat(formatPercent)
  .ticks(5)
  .tickSizeInner(-width)
  .tickSizeOuter(0)
  .tickPadding(10)
;
  
//draw axes
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
;
svg.append("g")
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
  .classMap(classMap)
  .classMapFunction(classMapFunction)
  .x0( x0 )
  .x1( x1 )
  .y( y )
  .groupRangeFunction(groupRangeFunction)
;

window.test=test;

test(svg, jsonObj);


/***************** TABLE ****************/



/**

 Load all the FIs into an array to store the different tables for each FI.

 A call to getInsigtsData("sig_credit") returns an Object with keys = FIs and
 values are an array of objects

 Object {All Issuers: Array[{ amt_fee: 684.33,
                              amt_sale: 322.3,
                              avg_fee: 0.54223,
                              fee_pc: 1.9332,
                              mcc: "5311",
                              mcc_name: "Department Store",
                              n_card: 4432,
                              n_trans: 3322,
                              sale_pc: 112.65,
                              trans_pc: 3.223},
                            { amt_fee: 684.33, ... mcc_name: "Grocery", ... },
                            { amt_fee: 684.33, ... mcc_name: "Family Clothing", ... },
                            { amt_fee: 684.33, ... mcc_name: "Fast Food", ... },
                            { amt_fee: 684.33, ... mcc_name: "Pharmacies", ... },
                            { amt_fee: 684.33, ... mcc_name: "Total", ... }],
        Issuer 1: Array[6],
        Issuer 2: Array[6],
        Issuer 3: Array[6],
        Issuer CUs: Array[6],
        My Finantical Institution: Array[6]}

 calling Object.keys(getInsightsData("sig_credit")) will return an array of only the FIs
 e.g ["All Issuers", "Issuer 1", "Issuer 2", "Issuer 3", "Issuer CUs", "My Financial Institutions"]


 */
var FIs = Object.keys(getInsightsData("sig_credit"));
console.log("FIs = ", FIs);

/**
 call all data belonging to a specific FI, "All Issuers"
 returns an array of Objects
 each Object contains transaction data -> {amt_fee: 6435, amt_sale: 3221, etc.}
 for each mcc_name (Department Store, Grocery, Family Clothing, Fast Food, Pharmacies, Total)
 */
var insightsData = getInsightsData("sig_credit", FIs[0]);
console.log("var insightsData = ", getInsightsData("sig_credit", FIs[0]));


console.log("values of insightsData = ", Object.values(insightsData));

/** store all the values into tableData [{amt_fee: 684.33, ...}{...},{...},{...},{...}] **/
var tableData = Object.values(insightsData);

/** create a columns property that has all the keys in the array of objects ["amt_fee", "amt_sale", ...] **/
tableData.columns = Object.keys(insightsData[0]);

/** shows all the different mcc_names for a specific FI ["Department Store", "Grocery", ...] **/
insightsData.forEach(function(element) {console.log("element: ", element.mcc_name);});
console.log(insightsData[FIs[0]]);
console.log("tableData: ", tableData);


//Create basic table with class of table for bootstrap

/**
 * create a title for the table that specifies which FI table is being displayed
 * This can be built on later to swap tables between FIs by using the FIs array
 * For now it is just taking the first element, FIs[0] which = "All Issuers" to
 *
 **/
var title = d3.select("#drawtable")
    .select("#tablename")
    .append("p")
    .text(FIs[0]); // "All Issuers"

var table = d3.select("#drawtable")
    .append("table")
    .attr("class", "table");


 table.append("thead");
 table.append("tbody");

//add import function to variable for use
var drawTable = tableChart();

//call data and then return table with data inside
// d3.csv("scripts/charts/table/table-data-sample.csv", function (error, data) {
//   console.log(data);
//   drawTable(d3.select("#drawtable"), data);
// });

drawTable(d3.select("#drawtable"), tableData);

 /***************** DONUT ****************/
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

function type(d) {
  d.number = +d.number;
  return d;
}

/*
var test = donutChart()
  .innerText("NEW TEXT")
  .padAngle(0.03)
  .hoverRad(15)
;

d3.csv("scripts/donut/donutdata.csv", type, function(error, data) {
  test(svg, data);
  var filtered = data.filter( function(d){
    if ( d.transactionType == "declines")
      return true;
    return false;
  });

  window.test = test;
  window.filtered = filtered;
  window.svg = svg;
  window.data = data;
});*/


var jsonData = [
  {
    "mcc_name": "Department Store",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Grocery",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Family Clothing",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Fast Food",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Pharmacies",
    "avg_fee": 0.29486
  }
];

var valueFunction = function(d){
  return d.avg_fee;
}
var constancyFunction = function(d){
  return d.mcc_name;
}
var classMapFunction = function(d){
  return classMap[d.data.mcc_name];
}

//This data would be received by the controller
//where txn_type = sig_debit and fi= "My Financial Institution"
var classMap = {"Department Store": "fill-blue", "Grocery": "fill-red",
 "Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
  "Pharmacies": "fill-teal"};

var innerNumber = 0;
jsonData.forEach(function(d,j){
  innerNumber += d.avg_fee;
});


innerNumber = innerNumber / jsonData.length;

var testTwo = donutChart()
  .classMap(classMap)
  .valueFunction(valueFunction)
  .constancyFunction(constancyFunction)
  .classMapFunction(classMapFunction)
  .innerRad(50)
  .innerNumber(innerNumber)
  .innerText("AVG INTERCHANGE")
  .padAngle(0.03)
;

testTwo(svg, jsonData);

//For testing in console
//Change data sets using testTwo(svg, filteredJsonData) and testTwo(svg, jsonData)

window.testTwo = testTwo;
window.svg = svg;
window.jsonData = jsonData;

var filteredJsonData = [
  {
    "mcc_name": "Grocery",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Family Clothing",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Fast Food",
    "avg_fee": 0.29486
  },
  {
    "mcc_name": "Pharmacies",
    "avg_fee": 0.29486
  }
];

var filteredJsonDataTwo = [
  {
    "mcc_name": "Grocery",
    "avg_fee": 0.29486
  }
];

var filteredJsonDataThree = [
 
];

window.filteredJsonData = filteredJsonData;
window.filteredJsonDataTwo = filteredJsonDataTwo;
window.filteredJsonDataThree = filteredJsonDataThree;