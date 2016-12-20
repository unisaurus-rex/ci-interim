import {getInsightsData} from 'model';

/* data is structured so we can easitly extract all information by transaction type
   ie sig_debit, pin_debit, sig_credit
   can also extract data by transaction type and fi
   ie sig_credit for issuer1
*/
describe("filtering data", function() {
  
  describe("filters by transaction type", function() {
    var result = getInsightsData("sig_credit");
    var keys = Object.keys(result);

    it("result is object with five keys, one per fi", function() {
      expect(keys.length).toBe(5);
    });
    
  });

  describe("filters by transaction type and fi", function() {
    var result = getInsightsData("sig_debit", "All Issuers");

    it("result is array", function() {
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
