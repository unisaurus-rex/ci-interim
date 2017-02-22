import {getSegmentData} from 'stackedController';

xdescribe("The stacked contoller should", function() {


  describe("return spend data", function() {
    
    var getData;
    var data;

    beforeEach(function() {
      getData = getSegmentData().fi("My Financial Institution").column("amt_sale");
      data = getData();
    });

    afterEach(function(){
      getData = null;
      data= null;
    });
    
    it('that is defined and not null', function() {
      expect(data).not.toBeNull();
      expect(data).toBeDefined();
    });

    it("is an array", function() {
      expect(Array.isArray(data)).toBe(true);
    });

    it("that is an array of the correct size", function() {
      expect(data.length).toBe(1);
    });

    it("that is an array contaiing an object", function() {
      var test = function (){ return typeof data[0] === "object" }
    });

    it("with an object containing the correct properties", function(){
      var obj = data[0];
      var test = false;

      if (obj.hasOwnProperty('Department Store') && obj.hasOwnProperty('Grocery') && obj.hasOwnProperty('Pharmacies') && obj.hasOwnProperty('Fast Food') && obj.hasOwnProperty('Family Clothing') && obj.hasOwnProperty('total')){
        test = true
      }
      expect(test).toBe(true)
    });

    it("as an array containing a columns property", function(){
      expect(data.hasOwnProperty('columns')).toBe(true);
    });

  });

 

});
