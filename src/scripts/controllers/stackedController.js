import {getInsightsData} from 'model';
import * as d3 from "d3";


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

    //console.log(amtSaleGrocery, amtSalePharmacies, amtSaleDepartmentStore, amtSaleFamilyClothing, amtSaleFastFood, amtSaleTotal)

    var percentageDepartmentStore = amtSaleDepartmentStore / amtSaleTotal;
    var percentageGrocery =  amtSaleGrocery / amtSaleTotal;
    var percentagePharmacies =  amtSalePharmacies / amtSaleTotal;
    var percentageFamilyClothing =  amtSaleFamilyClothing / amtSaleTotal;
    var percentageFastFood =amtSaleFastFood / amtSaleTotal;
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

  return getData;
}



export function getPurchaseByMerchantSegmentData(){

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

    var salePcDepartmentStore = 0;
    var salePcGrocery = 0;
    var salePcPharmacies = 0;
    var salePcFamilyClothing = 0;
    var salePcFastFood =0;
    var salePcTotal = 0; 

    for (var i =0; i < data.length; i++)
    {
      if( data[i].mcc_name == "Department Store" ){
        salePcDepartmentStore = data[i].sale_pc + salePcDepartmentStore;
      } 
      if( data[i].mcc_name == "Grocery" ){
        salePcGrocery = data[i].sale_pc + salePcGrocery;
      } 
      if( data[i].mcc_name == "Pharmacies" ){
        salePcPharmacies = data[i].sale_pc + salePcPharmacies;
      } 
      if( data[i].mcc_name == "Family Clothing" ){
        salePcFamilyClothing = data[i].sale_pc + salePcFamilyClothing;
      } 
      if( data[i].mcc_name == "Fast Food" ){
        salePcFastFood = data[i].sale_pc + salePcFastFood;
      } 
      salePcTotal = salePcTotal + data[i].sale_pc;
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

  return getData;
}
