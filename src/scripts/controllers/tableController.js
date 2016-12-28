/**
 * @module tableController
 */

import {getInsightsData} from 'model';

/**
 * Take data from the model for a specific transaction type and return
 * a data structure that can be used by the table drawing function
 * @function getData
 * @returns {function} - configurable function that can be used to format table data 
 */
export function getData() {
  var txnType;

  function dataBuilder(param) {
    var insightsData = getInsightsData(txnType); // result is object with keys for each fi and values of arrays of objects

    // get list of unique mcc_names
    var mccNames = uniqueMccNames(insightsData); 

    // use list of names to build array of row objects
    return buildTableData(insightsData, param, mccNames);
  };

  dataBuilder.txnType = function(type) {
    if(!arguments.length) {
      return txnType;
    }

    txnType = type;
  };
  
  return dataBuilder;
}

/***** Private Functions *****/
// this var for exporting functions to be tested only, not intended to be used in code
export var testing = {uniqueMccNames: uniqueMccNames,
                      buildTableData: buildTableData
                     };
/**
 * Find the unique mcc_name properties
 * @private
 * @function uniqueMccNames
 * @param {Object} data - object belonging to transaction type in the model
 * @returns {string[]}
 */
function uniqueMccNames(data) {
  // for each fi, get all mcc_names, result is array of arrays
  var fiNames = Object.keys(data);
  var mccArrays = fiNames.map( (fi) => {
    var arr = data[fi];
    return arr.map( (obj) => {
      return obj.mcc_name; 
    });
  });

  // join arrays to form single array
  var allMccNames = mccArrays.reduce( (res, current) => {
    return res.concat(current);
  }, []);

  // remove repeated values 
  return Array.from(new Set(allMccNames)); 
}

/**
 * Return the data structure needed by the table drawing function
 * @private
 * @function buildTableData
 * @param {Object} data - object belonging to transaction type in the model
 * @param {string} param - value to extract
 * @param {string[]} mccNames - mccNames to use for columns and headers
 * @returns {Object[]} array of objects
 */
function buildTableData(data, param, mccNames) {
  // need to build one object per fi
  var fiNames = Object.keys(data);
  // each object should have key/values = mcc_name: param
  // each object also needs an fi key
  var tableData = fiNames.map( (fi) => {
    // value of each fi key is an array of objects
    // table is expecting array of objects, one object per row
    // reduce array of objects to one object
    let rowObj = data[fi].reduce( (res, obj) => {
      // extract the requested param from the object
      let key = obj.mcc_name; 
      res[key] = obj[param];
      return res;
    }, {});

    // add an fi key
    rowObj["fi"] = fi;

    return rowObj;
    
  });

  tableData.columns = ["fi", ...mccNames];
  tableData.headers = ["FI", ...mccNames];

  return tableData;
}
