/**
 *@module model
 *@description model depends on a json file of insights data existing
 * the model presumes that the data is formatted as specified in
 * the csv-parser project (https://github.com/unisaurus-rex/csv-parser) 
 */

/***** local packages *****/
import {dataJSON} from 'data';

/***** model *****/
var insightsData = JSON.parse(dataJSON, typeConverter);

/**
 * public interface for retrieving data
 * @function getInsightsData
 * @param {string} txn_type - transaction type you want to retrieve data for
 * @param {string} [fi] - financial instituation you want to retrieve data for  
 * @returns {Obj}
 * @description retrieve data for a specific transaction type, or optionally, a fi of a transaction type
 */
export function getInsightsData(txn_type, fi) {
  var o = insightsData[txn_type];

  if(fi){
    return o[fi];
  }

  return o;
}

/**
 * reviver callback passed as second argument to JSON.parse
 * @function typeConverter
 * @param {string} key - key from a json string
 * @param {string} value - value belonging to key in json string
 * @returns {float | int}
 * @description convert a data value from a json string to the appropriate type
 */
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


