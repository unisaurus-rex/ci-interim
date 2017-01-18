import {getInsightsData} from 'model';
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import donutChart from 'donut';
import * as d3 from "d3";
import Panel from "panel";
import Checkboxes from 'checkboxes';
import {toolTips} from 'tooltips';

var charts = {};

var sumFunc = function sum(data, column){
  var number = 0;
  data.forEach( function(d, j){
    number += d[column];
  })
  return number;
}

var avgFunc = function average(data, column){
  var number = 0;
  if (data.length ==0){
    return 0;
  }
  data.forEach( function(d, j){
    number += d[column];
  })
  number = number / data.length;
  return number;
}

var columnConfig ={
  "amt_fee": {"innerText": "TOTAL INTERCHANGE", "innerNumber": sumFunc },
  "avg_fee": {"innerText": "AVG INTERCHANGE", "innerNumber": avgFunc},
  "fee_pc": {"innerText": "INTERCHANGE BY CARD", "innerNumber": avgFunc},
  "amt_sale": {"innerText": "TOTAL SALES", "innerNumber":  sumFunc},
  "avg_sale": {"innerText": "AVG SALE", "innerNumber":  avgFunc},
  "sale_pc": {"innerText": "AMOUNT PER CARD", "innerNumber":  avgFunc},
  "n_trans": {"innerText": "TOTAL TRANS", "innerNumber":  sumFunc},
  "n_card": {"innerText": "TOTAL CARDS USED", "innerNumber":  sumFunc},
  "trans_pc": {"innerText": "TRANS BY CARD", "innerNumber":  avgFunc} 
}

export var donutExport = {
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

/**
 * add or update chartname.data based on txnType and fi
 */ 
export function buildData(chartname, txnType, fi) {
  
  // if chartname object doesn't exist, build new object and add data property
  //chartname is the selector for the panel
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.data = getInsightsData(txnType, fi);
    p.data = p.data.filter(function (obj){
      return obj.mcc_name != "Total";
    })

    charts[chartname] = p;

    var dropDownSelect = chartname + " .dropdown-menu li";
    p.dropdown = d3.select( dropDownSelect ).attr("value");
  }
  else{
    charts[chartname].data = getInsightsData(txnType, fi);

    charts[chartname].data = charts[chartname].data.filter(function (obj){
      return obj.mcc_name != "Total";
    }) 

    var dropDownSelect = chartname + " .dropdown-menu li";
    charts[chartname].dropdown = d3.select( dropDownSelect ).attr("value"); 


  }
  return charts[chartname].data;
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

/**
 * @function setMargins
 */
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

/**
 * @function drawSvg
 */
function drawSvg(chartname){

  var width = charts[chartname].svg.width;
  var height = charts[chartname].svg.height;
  
  var svgSelect = chartname + " .donut";

  var interchangeDonutSvg = d3.select( svgSelect )
      .classed("svg-container", true)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
  //class for responsivenesss
      .classed("svg-content-responsive-pie", true)
      //.attr("width", width)
      //.attr("height", height)
      .append("g")
  //      .attr("id", "donutchart")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  ;
}

/**
 * @function createDrawingFunc
 * @param {Object} config - donutConfig object
 */
function createDrawingFunc(chartname, config) {
  let func = donutChart() 
      .classMap(config.classMap)
      .constancyFunction(config.constancyFunction)
      .classMapFunction(config.classMapFunction)
      .innerRad(config.innerRad)
      .innerText( columnConfig [charts[chartname].dropdown].innerText )
      .padAngle(config.padAngle)
      .column( charts [chartname].dropdown )
      .innerNumberFunc ( columnConfig [charts[chartname].dropdown].innerNumber)
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
    // used returned checked value array to filter data
    let filteredData = charts[chartname].data.filter(function (obj){
      if (arr.indexOf(obj.mcc_name) == -1) {
        return false;
      }
      return true;
    })

    let loc = d3.select(chartname + " svg g");

    //console.log(data);
    charts[chartname].drawFunc(loc, filteredData);
    //Tooltips
    toolTips();
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
    let current = d3.select(this).attr('value');
    let old = charts[chartname].dropdown;

    if( current != old) {
      // set dropdown param
      setDropdown(chartname, current);

      //UPDATE VALUE FUNCTION, INNERTEXT, INNERNUMBER?
      charts[chartname].drawFunc.innerText( columnConfig [charts[chartname].dropdown].innerText);
      charts[chartname].drawFunc.innerNumberFunc ( columnConfig[ charts[chartname].dropdown].innerNumber);
      charts[chartname].drawFunc.column( charts [chartname].dropdown );

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
