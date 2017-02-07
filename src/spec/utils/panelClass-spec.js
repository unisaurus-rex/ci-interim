import Panel from 'panelClass';

describe('Panel class:', function() {

  describe('checkbox toggle', function() {
    var p = new Panel();
    var valArr = ['one', 'two', 'three'];
    var defaultArr = [false, false, false]; 
    var resetCount;

    beforeEach(function() {
      // initialize checkboxes
      p.createCboxes(valArr, defaultArr);
      resetCount = p.resetCount;
    });
               
    it('checking a box reduces the reset count', function() {
      // flip a checkbox to checked
      p.toggleCheckbox('one');
      expect(p.resetCount).toBe(resetCount - 1);
    });

    it('toggling the same checkbox twice produces the original reset count', function() {
      p.toggleCheckbox('one');
      p.toggleCheckbox('one');
      expect(p.resetCount).toBe(resetCount);
    });

    it('checking all checkboxes sets resetCount to 0', function() {
      p.checkAll();
      expect(p.resetCount).toBe(0);
    });
  });

  describe('setting svgSize', function() {
    describe('validation', function() {
      var badVal1 = "bad";
      var badVal2 = {width: 8};
      var badVal3 = {height: 8};
      var goodVal = {width: 8, height: 8};
      var p = new Panel();
      
      it('returns false if the value is not an object', function() {
        expect(p._validateSvgSize(badVal1)).toBe(false);
      });

      it('returns false if the value is missing a height property', function() {
        expect(p._validateSvgSize(badVal2)).toBe(false);
      });

      it('return false if the value is missing a width property', function() {
        expect(p._validateSvgSize(badVal3)).toBe(false);
      });

      it('returns true if the value is an object with width and height properties', function() {
        expect(p._validateSvgSize(goodVal)).toBe(true);
      });
    });

    describe('error handling', function() {
      it('throws an error if the value fails validation', function() {});
      it('the error contains a message string', function() {});
    });
  });

  describe('setting svgMargins', function() {
    describe('validation', function() {
      it('returns false if the value is not an object', function() {}); 
      it('returns true if the value is an object with top, bottom, left and right properties', function() {});
      it('returns false if the value is missing a top property', function() {});
      it('returns false if the value is missing a bottom property', function() {});
      it('returns false if the value is missing a left property', function() {});
      it('returns false if the value is missing a right property', function() {});
    });

    describe('error handling', function() {
      it('throws an error if the value fails validation', function() {});
      it('the error contains a message string', function() {});
    });

  });

});
