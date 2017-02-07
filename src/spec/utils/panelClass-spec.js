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
  });

});
