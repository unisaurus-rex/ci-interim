import {getInsightsData} from 'model';
import addBootstrapCheckboxObservers from 'checkboxObserver';
import donutChart from 'donut';
import * as d3 from "d3";
import Panel from "panel";

var charts = {};



export var donutExport = {
  setSvgSize: setSvgSize,
  setMargins: setMargins,
  buildChartData: buildChartData,
  drawSvg: drawSvg
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
    .attr("id", "donutchart")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  ;
}

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
 * add or update chartname.data based on txnType and fi
 */ 
export function buildChartData(chartname, txnType, fi) {
  
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

export function createDrawingFunc(chartname, location) {
  let func = donutChart();

  // create new object for chartname if it doesn't exisit
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.draw = func;
    charts[chartname] = p;
  } else {
    // update drawing function in charts
    charts[chartname].draw = func;
  }

  // return the drawing function so the user can configure it and/or use it themselves
  return func;
}

// Call the drawing function associated with a chartname
export function draw(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    let data = charts[chartname].data;
    let loc = charts[chartname].location;

    charts[chartname].draw(loc, data);
  }  
}

/**
 * Create mutation observers and track them in the charts object
 * @function initObservers
 */
export function initObservers(chartname, idArr, valArr, defaultArr, callback){
  // if charts.chartname does not exist, build it 
  if(!charts.hasOwnProperty(chartname)) {
    charts[chartname] = {};
  }

  let observersFunc = addBootstrapCheckboxObservers()
      .elementIds(idArr)
      .values(valArr)
      .defaults(defaultArr)
      .callback(callback);

  charts[chartname].observersFunc = observersFunc;
  charts[chartname].observers = observersFunc();
}


/**
 * Disconnect observerers associated with chartname object in charts
 */
export function disconnectObservers(chartname) {
  console.log(charts);
  if(charts.hasOwnProperty(chartname)) {
    // disconnect each observer in observers array
    charts[chartname].observers.forEach( (obs) => {
      obs.disconnect(); 
    });

    // set observers array to empty
    charts[chartname].observers = [];
  }
}

/**
 * Create new mutation observers under the chartname object in charts
 */
export function updateObservers(chartname, defaults, callback) {
  // TODO: if observers array is not empty, call disconnect first
  if(charts.hasOwnProperty(chartname)) {
    let obsFunc = charts[chartname].observerFunc;

    // update observer func with new config values
    obsFunc.defaults(defaults).callback(callback);

    // create new observers and store them in the charts
    charts[chartname].observers = obsFunc();
  }
}



