import {getInsightsData} from 'model';
import * as d3 from "d3";
import Panel from "panel";
import stackChart from 'stacked';
import Checkboxes from 'checkboxes';
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import {toolTips} from 'tooltips';

var charts = {};

window.charts = charts;

export var stackExport = {
  setSvgSize: setSvgSize,
  setMargins: setMargins,
  buildData: buildData,
  drawSvg: drawSvg,
  draw: draw,
  createDrawingFunc: createDrawingFunc,
  toggleCheckbox: toggleCheckbox,
  observerCallbackBuilder: observerCallbackBuilder,
  initObservers: initObservers,
  addDropdownListener: addDropdownListener
}

var getData;

/**
 * @function createDrawingFunc
 * @param {Object} config - stackConfig object
 */
function createDrawingFunc(chartname, config) {

  let func = stackChart() 
      .width( charts[chartname].svg.width)
      .height(charts[chartname].svg.height)
      .margin( charts[chartname].svg.margins )
      .classMap(config.classMap)
      .classMapFunction(config.classMapFunction)
  ;

  // create new object for chartname if it doesn't exisit
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.drawFunc = func;
    charts[chartname] = p;
  } else {
    // update drawing function in charts
    charts[chartname].drawFunc = func;
  }
}

// Call the drawing function associated with a chartname
function draw(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    
    let arr = charts[chartname].cboxes.getAllChecked();


  var filteredData = [];
  var SpendStackObj = {};
  filteredData[0] = SpendStackObj;
  //filter data
  for (var i =0; i< arr.length; i++){
    filteredData[0] [ arr[i] ] = charts[chartname].data[0] [ arr[i] ];
  }
  filteredData[0].total = 1;

  filteredData.columns = Object.keys(filteredData[0]).filter(function (obj){
    return obj != "total";
  })

    let loc = d3.select(chartname + " svg");

    charts[chartname].drawFunc(loc, filteredData);

    //Tooltips
    toolTips();
  }  
}

/**
 * @function setSvgSize
 */
function setSvgSize(chartname, width, height){
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.svg.width = width;
    p.svg.height = height;

    charts[chartname] = p;
  }
  else{
    charts[chartname].svg.width = width;
    charts[chartname].svg.height = height;
  }
}

function setMargins(chartname, margins){
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel(); 
    p.svg.margins = margins;

    charts[chartname] = p;
  }
  else{
    charts[chartname].svg.margins = margins;
  }
}

function drawSvg(chartname){

  var width = charts[chartname].svg.width;
  var height = charts[chartname].svg.height;
  
  var svgSelect = chartname + " .stack";

  var svgSpendStack = d3.select(svgSelect)  .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")     
    .attr("viewBox","0 0 " + width + " " + height)
  ;
}

/**
 * add or update chartname.data based on txnType and fi
 */
function buildData(chartname, fi, column) {

  getData = getSegmentData().fi(fi).column(column);
  
  // if chartname object doesn't exist, build new object and add data property
  //chartname is the selector for the panel
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.data = getData();



    charts[chartname] = p;

    var dropDownSelect = chartname + " .dropdown-menu li";
    p.dropdown = d3.select( dropDownSelect ).attr("data-value");
  }
  else{
    charts[chartname].data = getData();


   var dropDownSelect = chartname + " .dropdown-menu li";
    charts[chartname].dropdown = d3.select( dropDownSelect ).attr("data-value"); 
  }
}

/*
 * @function addCheckboxes
 */
function addCheckboxes(chartname, valArr, defaultArr) {
  let cboxes = new Checkboxes(valArr, defaultArr);

  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.cboxes = cboxes;
       
    charts[chartname] = p;
  } else {
    charts[chartname].cboxes = cboxes;
  } 
}

/**
 * @function toggleCheckbox
 */
function toggleCheckbox(chartname, value) {
  if(charts.hasOwnProperty(chartname)){
    if(charts[chartname].cboxes != null){
      return charts[chartname].cboxes.toggle(value);
    }
  } else {
    throw new Error("Attempt to reference non-existent panel object");
  }
} 

/**
 * @function observerCallbackBuilder 
 */
function observerCallbackBuilder(chartname) {
  return function(value) {
    if(charts.hasOwnProperty(chartname)){

      let chart = charts[chartname];
      let resetCount = chart.resetCount;

      // resetCount is used to insure that on a dropdown change, the svg is only redrawn once,
      // if we don't use resetCount, the svg will be redrawn once for every unchecked checkbox
      if(resetCount == 0) {
        // dropdown paramater has not changed, only the checkbox values

        // toggle checkbox value in charts[chartname]
        chart.cboxes.toggle(value);
        draw(chartname);
      } else if(resetCount > 1) {
        chart.cboxes.toggle(value);
        chart.resetCount -= 1;
      } else {
        // reset == 1
        // dropdown parameter has changed, time to do work

        // update resetCount
        chart.resetCount -= 1;

        // toggle checkbox value in charts[chartname]
        chart.cboxes.toggle(value);

        // call draw 
        draw(chartname);
      }
    } else {
      throw new Error("Attempt to reference non-existent panel object");
    }
  };
}

/**
 * Create mutation observers and track them in the charts object
 * @function initObservers
 */
function initObservers(chartname, idArr, valArr, defaultArr, callback){
  addCheckboxes(chartname, valArr, defaultArr); 

  let observerFunc = addBootstrapCheckboxObservers()
      .elementIds(idArr)
      .callback(callback);

  let observers = observerFunc();

  // if charts.chartname does not exist, build it 
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.observers = observers; 
    p.observerFunc = observerFunc;
  } else {
    charts[chartname].observerFunc = observerFunc;
    charts[chartname].observers = observers;
  }
  
}

function setDropdown(chartname, value) {
  if(charts.hasOwnProperty(chartname)){
    charts[chartname].dropdown = value; 
  } else {
    throw new Error("Attempt to add dropdown parameter to non-existent panel object in charts");
  }
}

function setResetCount(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    let cboxes = charts[chartname].cboxes;
    let count = Object.keys(cboxes.getAll()).length - cboxes.getAllChecked().length;

    charts[chartname].resetCount= count;

    //if count is 0 a checkmark event never gets fired, meaning the chart does not get redrawn but it needs to be
    if(count == 0){
      draw(chartname);
    }
  }
}

function dropdownCallbackBuilder(chartname) {
  // return d3 event callback
  return function(d) {

    // get dropdown values
    let current = d3.select(this).attr('data-value');
    let old = charts[chartname].dropdown;

    if( current != old) {
      // set dropdown param
      setDropdown(chartname, current);

      //UPDATE VALUE FUNCTION, INNERTEXT, INNERNUMBER?
      getData.column(charts [chartname].dropdown);
      charts[chartname].data = getData();

//      charts[chartname].drawFunc.column( charts [chartname].dropdown );

      // set reset count
      setResetCount(chartname);
    
      // check all checkboxes
      let selector = chartname + " .checkboxes label";
      d3.selectAll(selector).classed('active', true);
    }
  };
}

function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}

export function getSegmentData(){

  var fi = "My Financial Institution";
  var column = "sale_pc";

  function getData(){
    var bin1Data = getInsightsData("bin 1", fi);

    bin1Data = bin1Data.filter(function (obj){
      return obj.mcc_name != "Total"
    })

    var bin2Data = getInsightsData("bin 2", fi);

    bin2Data = bin1Data.filter(function (obj){
      return obj.mcc_name != "Total"
    })

    var data = bin1Data.concat(bin2Data);

    var salePcDepartmentStore = 0;
    var salePcGrocery = 0;
    var salePcPharmacies = 0;
    var salePcFamilyClothing = 0;
    var salePcFastFood =0;
    var salePcTotal = 0; 

    for (var i =0; i < data.length; i++)
    {
      if( data[i].mcc_name == "Department Store" ){
        salePcDepartmentStore = data[i] [column] + salePcDepartmentStore;
      } 
      if( data[i].mcc_name == "Grocery" ){
        salePcGrocery = data[i] [column] + salePcGrocery;
      } 
      if( data[i].mcc_name == "Pharmacies" ){
        salePcPharmacies = data[i] [column] + salePcPharmacies;
      } 
      if( data[i].mcc_name == "Family Clothing" ){
        salePcFamilyClothing = data[i] [column] + salePcFamilyClothing;
      } 
      if( data[i].mcc_name == "Fast Food" ){
        salePcFastFood = data[i] [column] + salePcFastFood;
      } 
      salePcTotal = salePcTotal + data[i] [column];
    }

    var percentageDepartmentStore = salePcDepartmentStore / salePcTotal;
    var percentageGrocery =  salePcGrocery / salePcTotal;
    var percentagePharmacies =  salePcPharmacies / salePcTotal;
    var percentageFamilyClothing =  salePcFamilyClothing / salePcTotal;
    var percentageFastFood =salePcFastFood / salePcTotal;
    
    var finalData = [];

    var obj = {
      "Department Store" : percentageDepartmentStore,
      "Grocery" : percentageGrocery,
      "Pharmacies" : percentagePharmacies,
      "Fast Food" : percentageFastFood,
      "Family Clothing" : percentageFamilyClothing,
      total: 1
    }


    finalData[0] = obj;

      finalData.columns = Object.keys(finalData[0]).filter(function (obj){
      return obj != "total";
    })

    return finalData;
  }

  getData.fi = function (value){
    if (!arguments.length) return fi;
      fi = value;
    return getData;
  }
  getData.column = function (value){
    if (!arguments.length) return column;
      column = value;
    return getData;
  }

  return getData;
}
