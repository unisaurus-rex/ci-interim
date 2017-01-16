import {getInsightsData} from 'model';
import * as d3 from "d3";
import Panel from "panel";
import stackChart from 'stacked';

var charts = {};

window.charts = charts;

export var stackExport = {
  setSvgSize: setSvgSize,
  setMargins: setMargins,
  buildData: buildData,
  drawSvg: drawSvg,
//  draw: draw,
  createDrawingFunc: createDrawingFunc
//  toggleCheckbox: toggleCheckbox,
//  observerCallbackBuilder: observerCallbackBuilder,
//  initObservers: initObservers,
//  addDropdownListener: addDropdownListener
}

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

  var getData = getPurchaseByMerchantSegmentData().fi(fi).column(column);
  
  // if chartname object doesn't exist, build new object and add data property
  //chartname is the selector for the panel
  if(!charts.hasOwnProperty(chartname)) {
    var p = new Panel();
    p.data = getData();
    p.data.columns = Object.keys(p.data[0]).filter(function (obj){
      return obj != "total";
    })


    charts[chartname] = p;

    var dropDownSelect = chartname + " .dropdown-menu li";
    p.dropdown = d3.select( dropDownSelect ).attr("value");
  }
  else{
    charts[chartname].data = getData();

    charts[chartname].data.columns = Object.keys(charts[chartname].data[0]).filter(function (obj){
      return obj != "total";
    })

   var dropDownSelect = chartname + " .dropdown-menu li";
    charts[chartname].dropdown = d3.select( dropDownSelect ).attr("value"); 
  }
}


export function getSpendByMerchantSegmentData(){

  var fi = "My Financial Institution";

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

    var amtSaleDepartmentStore = 0;
    var amtSaleGrocery = 0;
    var amtSalePharmacies = 0;
    var amtSaleFamilyClothing = 0;
    var amtSaleFastFood =0;
    var amtSaleTotal = 0; 

    for (var i =0; i < data.length; i++)
    {
      if( data[i].mcc_name == "Department Store" ){
        amtSaleDepartmentStore = data[i].amt_sale + amtSaleDepartmentStore;
      } 
      if( data[i].mcc_name == "Grocery" ){
        amtSaleGrocery = data[i].amt_sale + amtSaleGrocery;
      } 
      if( data[i].mcc_name == "Pharmacies" ){
        amtSalePharmacies = data[i].amt_sale + amtSalePharmacies;
      } 
      if( data[i].mcc_name == "Family Clothing" ){
        amtSaleFamilyClothing = data[i].amt_sale + amtSaleFamilyClothing;
      } 
      if( data[i].mcc_name == "Fast Food" ){
        amtSaleFastFood = data[i].amt_sale + amtSaleFastFood;
      } 
      amtSaleTotal = amtSaleTotal + data[i].amt_sale;
    }

    var percentageDepartmentStore = amtSaleDepartmentStore / amtSaleTotal;
    var percentageGrocery =  amtSaleGrocery / amtSaleTotal;
    var percentagePharmacies =  amtSalePharmacies / amtSaleTotal;
    var percentageFamilyClothing =  amtSaleFamilyClothing / amtSaleTotal;
    var percentageFastFood =amtSaleFastFood / amtSaleTotal;
    
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

    return finalData;
  }

  getData.fi = function (value){
    if (!arguments.length) return fi;
      fi = value;
    return getData;
  }

  return getData;
}



export function getPurchaseByMerchantSegmentData(){

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

    //console.log(amtSaleGrocery, amtSalePharmacies, amtSaleDepartmentStore, amtSaleFamilyClothing, amtSaleFastFood, amtSaleTotal)

    var percentageDepartmentStore = salePcDepartmentStore / salePcTotal;
    var percentageGrocery =  salePcGrocery / salePcTotal;
    var percentagePharmacies =  salePcPharmacies / salePcTotal;
    var percentageFamilyClothing =  salePcFamilyClothing / salePcTotal;
    var percentageFastFood =salePcFastFood / salePcTotal;
    //console.log(percentageGrocery, percentagePharmacies, percentageDepartmentStore, percentageFamilyClothing, percentageFastFood);    
    
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
