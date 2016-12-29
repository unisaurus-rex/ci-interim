import {getInsightsData} from 'model';
import * as d3 from "d3";


export default function getData(){
	var txnType = "sig_debdfsit";
	var fi = "My Financial Institutionsdf";

	function getData(){
		var data = getInsightsData(txnType, fi);

		data = data.filter(function (obj){
			return obj.mcc_name != "Total";
		})

		//console.log(data);

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
