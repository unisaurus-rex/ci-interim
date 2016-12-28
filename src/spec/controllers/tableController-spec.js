import {getInsightsData} from 'model';
import {testing} from 'tableController';

describe("Table controller ", function() {

  var data = getInsightsData('sig_debit');

  describe("produces a list of unique mcc names", function() {
    var names = testing.uniqueMccNames(data);
    
    // returns array
    it("returns an array", function() {
      expect(Array.isArray(names)).toBe(true);
    });

    // has length greater than 0
    it("the array contains values", function() {
      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("builds the appropriate data structure", function(){
    var param = "n_trans";
    var names = testing.uniqueMccNames(data);
    var tableData = testing.buildTableData(data, param, names);

    // returns array
    it("returns an array", function() {
      expect(Array.isArray(tableData)).toBe(true);
    });

    // array has headers and columns property
    it("the array has a headers property", function() {
      expect(tableData.headers).toBeDefined();
    });

    it("the array has a columns property", function() {
      expect(tableData.columns).toBeDefined();
    });

    // array consists of objects
    it("the members of the array are objects", function() {
      var res = tableData.every(function(val) {return typeof val === "object";});

      expect(res).toBe(true);
    });

    // number of ojects equal to number of fis 
    it("the length of the array equals the number of fi keys in data", function() {
      var fiCount = Object.keys(data);

      expect(tableData.length).toBe(fiCount.length);
    });

    // each object has an fi property 
    it("each object in tableData has an 'fi' property", function() {
      var res = tableData.every(function(obj) {
        return obj.hasOwnProperty('fi');
      });

      expect(res).toBe(true);
    });

  });
});
