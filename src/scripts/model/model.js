/***** local packages *****/
import {dataJSON} from 'data';

/***** model *****/
var insightsData = JSON.parse(dataJSON, typeConverter);

// revier callback from json.parse
// callback should return a value
function typeConverter(key, value) {
  // reviver passes key as string
  switch (key) {
  case "amt_fee" :
    return parseFloat(value);
    break;
  case "amt_sale":
    return parseFloat(value);
    break;
  case "avg_fee":
    return parseFloat(value);
    break;
  case "avg_sale":
    return parseFloat(value);
    break;
  case "fee_pc":
    return parseFloat(value);
    break;
  case "n_card":
    return parseInt(value);
    break;
  case "n_trans":
    return parseInt(value);
    break;
  case "sale_pc":
    return parseFloat(value);
    break;
  case "trans_pc":
    return parseFloat(value);
    break;
  default: 
    return value;
    break;
  }

}

export function getInsightsData(txn_type, fi) {
  var o = insightsData[txn_type];

  if(fi){
    return o[fi];
  }

  return o;
}
