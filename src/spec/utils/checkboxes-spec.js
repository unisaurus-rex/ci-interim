import Checkboxes from 'checkboxes'; 

describe("Checkboxes: ", function() {
  describe("initialized with one parameter", function() {
    var cbox = new Checkboxes(['one', 'two', 'three']);

    it("has default values of false", function() {
      var checkedArray = cbox.getAllChecked();

      expect(checkedArray.length).toBe(0);
    });
  });

  describe("initialized with two parameters", function() {
    var cbox = new Checkboxes(["one", "two"], [true, false]);
    

    it('has values equal to second parameter', function() {
      var result = {"one": true, "two": false};

      expect(cbox.getAll() ).toEqual(result);
    });
    
  });

  describe("initialized with no parameters", function() {
    var err;
    
    beforeAll(function() {
      try {
        var c = new Checkboxes();
      }
      catch(e) {
        err = e;
      }
    });
    
    it("throws an error", function() {
      expect(err).toBeDefined();
    });

    it("the error message is not empty ", function() {
      expect(err.message.length).toBeGreaterThan(0);
    });
       
  });
});
