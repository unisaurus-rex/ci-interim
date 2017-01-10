import {getInsightsData} from 'model';
import addBootstrapCheckboxObservers from 'checkboxObserver';
import donutChart from 'donut';
import * as d3 from "d3";

var charts = {};

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
export function buildChartData(chartname, txnType, fi) {
  // if chartname object doesn't exist, build new object and add data property
  if(!charts.hasOwnProperty(chartname)) {
    charts[chartname] = {data: getInsightsData(txnType, fi)}
  }

  // if chartname object exists, add/update data
  charts[chartname].data = getInsightsData(txnType, fi);
}

export function createDrawingFunc(chartname, location) {
  let func = donutChart();

  // create new object for chartname if it doesn't exisit
  if(!charts.hasOwnProperty(chartname)) {
    charts[chartname] = {draw: func,
                         location: location}
  } else {
    // update drawing function in charts
    charts[chartname].draw = func;
    charts[chartname].location = location;
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



