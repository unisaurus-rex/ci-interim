import groupedBarController from 'groupedBarController';

describe("The grouped bar contoller should", function(){

	var data;
	var getData;

	beforeEach (function(){
		getData = groupedBarController().txnType("pin_debit");
    data = getData();

	});

	afterEach ( function(){
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

  it("return an array of objects with every object containing a valid Issuer key", function() {
  var test = true;
    for ( var i=0; i < data.length; i++){
    	if (data[i].Issuer != "All Issuers" && data[i].Issuer != "My Financial Institution" && data[i].Issuer != "Issuer 1" && data[i].Issuer != "Issuer 2"&& data[i].Issuer != "Issuer CUs"){
    		test = false
    	}
    }
    expect(test).toBe(true);
  });

  it("contain an array of objects with every object containing the correct keys", function() {
  var test = true;
    
    var keys = ["Department Store" , "Family Clothing", "Fast Food", "Grocery", "Issuer", "Pharmacies", "Total"]

    for ( var i=0; i < data.length; i++){
  		for(var j=0; j < keys.length; j++){
  			expect(data[i][keys[j] ]).not.toBeNull();
  			expect(data[i] [ keys[j] ]).toBeDefined();
  		}   	
    }
    expect(test).toBe(true);
  });

});
