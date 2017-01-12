import {getInsightsData} from 'model';
import addBootstrapCheckboxObservers from 'newCheckboxObserver';
import donutChart from 'donut';
import * as d3 from "d3";
import Panel from "panel";
import Checkboxes from 'checkboxes';

var charts = {};



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

window.charts = charts;
window.donutExport = donutExport;



// TODO: after changes, this function not needed
export function getData(){
  var txnType = null;
  var fi = null;

  function getData(){
    // user must set txnType and fi or call to getData will throw error
    if(txnType === null || fi === null){
      throw new Error("Called getData() with unset txnType or fi");
    }

    var data = getInsightsData(txnType, fi);

    data = data.filter(function (obj){
      return obj.mcc_name != "Total";
    })

    return data;
  }

  getData.txnType = function (value){
    if (!arguments.length) return txnType;
    txnType = value;
    return getData;
  }
  getData.fi = function (value){
    if (!arguments.length) return fi;
    fi = value;
    return getData;
  }

  return getData;
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


  }
}

/**
 * @function setSvgSize
 */
export function setSvgSize(chartname, width, height){
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
export function setMargins(chartname, margins){
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
      .attr("width", width)
      .attr("height", height)
      .append("g")
  //      .attr("id", "donutchart")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  ;
}

/**
 * @function createDrawingFunc
 * @param {Object} config - donutConfig object
 */
export function createDrawingFunc(chartname, config) {
  let func = donutChart() 
      .classMap(config.classMap)
      .valueFunction(config.valueFunction)
      .constancyFunction(config.constancyFunction)
      .classMapFunction(config.classMapFunction)
      .innerRad(config.innerRad)
      .innerNumber(config.innerNumber)
      .innerText(config.innerText)
      .padAngle(config.padAngle);

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
export function draw(chartname) {
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
export function toggleCheckbox(chartname, value) {
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
export function observerCallbackBuilder(chartname) {
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
        // call draw 
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
export function initObservers(chartname, idArr, valArr, defaultArr, callback){
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

      // set reset count
      setResetCount(chartname);
    
      // check all checkboxes
      let selector = chartname + " .checkboxes label";
      d3.selectAll(selector).classed('active', true);
    }
  };
}

export function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}
