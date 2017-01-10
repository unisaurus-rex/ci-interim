import {getInsightsData} from 'model';
import * as d3 from "d3";


export default function getData(){
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
