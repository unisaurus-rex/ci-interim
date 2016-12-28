import {getInsightsData} from 'model';
import * as d3 from "d3";


export default function getData(){
	var txnType = "sig_debit";

	function getData(){
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
		    groupedBarData[i] [insightsData [issuers[i] ] [j].mcc_name] = insightsData [issuers[i] ] [j].fee_pc;
		  }
		}
		var jsonGroupNames = d3.keys(groupedBarData[0]).filter(function(key) { return key !== "Issuer"; });

		groupedBarData.forEach(function(d) {
	  		d.groups = jsonGroupNames.map(function(name) { return {name: name, value: +d[name]}; });
		});

		groupedBarData.columns = jsonGroupNames;

		return groupedBarData;	
	}

	getData.txnType = function (value){
    if (!arguments.length) return txnType;
    	txnType = value;
    return getData;
	}

	return getData;
}




