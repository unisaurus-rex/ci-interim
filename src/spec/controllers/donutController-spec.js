import donutController from 'donutController';

describe("The donut contoller should", function() {

  var data;
  var getData;

  beforeEach(function() {
    getData = donutController()
      .txnType("sig_debit")
      .fi("My Financial Institution");
    data = getData();
  });

  afterEach(function() {
    data = [];
  });

  it('return data that is defined and not null', function() {
    expect(data).not.toBeNull();
    expect(data).toBeDefined();
  });

  it("return data in an array", function() {
    expect(Array.isArray(data)).toBe(true);
  });

  it("return data that is the correct size", function() {
    expect(data.length).toBe(5);
  });

  it("return an array of objects with every object containing a valid mcc_name", function() {
    var test = true;
    for (var i = 0; i < data.length; i++) {
      if (data[i].mcc_name != "Pharmacies" && data[i].mcc_name != "Department Store" && data[i].mcc_name != "Family Clothing" && data[i].mcc_name != "Fast Food" && data[i].mcc_name != "Grocery") {
        test = false
      }
    }
    expect(test).toBe(true);
  });
});