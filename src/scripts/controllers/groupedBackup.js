// Call the drawing function associated with a chartname
function draw(chartname) {
  if(charts.hasOwnProperty(chartname)) {
    
    let arr = charts[chartname].cboxes.getAllChecked();
    arr.push( "Issuer" );
    // used returned checked value array to filter data
    let filteredData = charts[chartname].data.map( (d) => {
      return arr.reduce( (result, key) => {result[key] = d[key];
                                           return result;}, {});
    });  

    //add group attribute
    var jsonGroupNames = d3.keys(filteredData[0]).filter(function(key) { return key !== "Issuer"; });
    filteredData.forEach(function(d) {
      d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    filteredData.columns = jsonGroupNames;


    let loc = d3.select(chartname + " svg");

    charts[chartname].drawFunc.column(charts[chartname].dropdown);
    charts[chartname].drawFunc(loc, filteredData);
    toolTips();
  }  
}


/**
 * @function createDrawingFunc
 * @param {Object} config - groupedBarConfig object
 */
function createDrawingFunc(chartname, config) {

  let func = groupedBarChart() 
      .width( charts[chartname].svg.width - charts[chartname].svg.margins.left- charts[chartname].svg.margins.right)
      .height(charts[chartname].svg.height - charts[chartname].svg.margins.top- charts[chartname].svg.margins.bottom)
      .classMap(config.classMap)
      .classMapFunction(config.classMapFunction)
      .groupRangeFunction(config.groupRangeFunction)
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


/**
 * @function drawSvg
 */
function drawSvg(chartname){

  var width = charts[chartname].svg.width;
  var height = charts[chartname].svg.height;
  
  var svgSelect = chartname + " .grouped";

  var gBarSvg = d3.select(svgSelect)
      .append("div")
      .classed("svg-container", true)
      .append("svg")  
      .attr("viewBox", "-" + charts[chartname].svg.margins.left + " -"+ charts[chartname].svg.margins.top + " "+ width + " " + height)
      .classed("svg-content-responsive", true)
  ;

  return gBarSvg;
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

      //UPDATE VALUE FUNCTION, IF ALL CHECKBOXES ARE CHECKED AND A DROPDOWN CHANGES DRAW DOES NOT GET CALLED
      get [chartname].column( current )
      charts[chartname].data = get[chartname](); 


      // set reset count
      setResetCount(chartname);
      
      // check all checkboxes
      let selector = chartname + " .checkboxes label";
      d3.selectAll(selector).classed('active', true);

      //update dropdown text
      updateDropdownText( chartname, d3.select(this).html());
      //update Panel Title
      updatePanelTitle( chartname, d3.select(this).html());
    }
  };
}

//
function updateDropdownText( chartname, text ){
  //console.log (chartname, text);
  let selection = chartname + " button";
  let button = d3.select( selection );
  button._groups[0][0].innerHTML = text +  "<span class='caret'> </span>";
}

function updatePanelTitle( chartname, text){
  let selection = chartname + " h2";
  let title = d3.select(selection);
  //console.log( d3.select (title._groups[0][0]).attr("data-value") );

  title._groups[0][0].innerText = d3.select (title._groups[0][0]).attr("data-value") + ": "+ text;

}

function addDropdownListener(chartname) {
  let selector = chartname + " .dropdown-menu li a";
  let cb = dropdownCallbackBuilder(chartname);
  d3.selectAll(selector).on('click', cb);
}


/**
 * add or update chartname.data based on txnType and fi
 */ 
function buildData(chartname, txnType) {
  get [ chartname ] = groupedFilter().txnType(txnType);
  
  // if chartname object doesn't exist, build new object and add data property
  //chartname is the selector for the panel
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    var dropDownSelect = chartname + " .dropdown-menu li a";
    p.dropdown = d3.select( dropDownSelect ).attr("data-value");

    get[chartname].column(p.dropdown);

    p.data = get[chartname]();
    charts[chartname] = p;

  }
  else{
    var dropDownSelect = chartname + " .dropdown-menu li a";
    charts[chartname].dropdown = d3.select( dropDownSelect ).attr("data-value");
    get [chartname].column(charts[chartname].dropdown);
    charts[chartname].data = get[chartname]();

  }

  //update dropdown
  updateDropdownText( chartname, d3.select(dropDownSelect).html());
  updatePanelTitle( chartname, d3.select(dropDownSelect).html());
  return charts[chartname].data;
}


export default function groupedFilter(){
  
  var txnType = null;
  var column = null;

  function updateData(){

    if (txnType == null){
      throw "txnType cannot be null";
    }

    if (column == null){
      throw "column cannot be null";
    }

    var data = getData(txnType, column);
    return data;
  }

  function getData(txnType, column){

    var insightsData = getInsightsData(txnType);	
    var issuers = Object.keys(insightsData) ;
    var groupedBarData = [];

    for( var i=0; i< issuers.length; i++){  
      //map Issuer to issuer to fi for every fi
      groupedBarData[i] = {
	Issuer: issuers[i]
      }

      //map every mcc_name to fee_pc for every fi
      for ( var j=0; j< insightsData[ [issuers[i] ] ].length; j++){
	groupedBarData[i] [insightsData [issuers[i] ] [j].mcc_name] = insightsData [issuers[i] ] [j] [column];
      }
    }
    var jsonGroupNames = d3.keys(groupedBarData[0]).filter(function(key) { return key !== "Issuer"; });

    groupedBarData.forEach(function(d) {
      d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    groupedBarData.columns = jsonGroupNames;

    return groupedBarData;	
  }

  updateData.txnType = function (value){
    if (!arguments.length) return txnType;
    txnType = value;

    if( value == null || value == undefined){
      throw "txnType cannot be null or undefined";
    }
    return updateData;
  }

  updateData.column = function (value){
    if (!arguments.length) return column;
    column = value;

    if( value == null || value == undefined){
      throw "column cannot be null or undefined";
    }
    return updateData;
  }

  return updateData;

}




