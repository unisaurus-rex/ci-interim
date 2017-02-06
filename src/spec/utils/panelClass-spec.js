import Panel from 'panelClass';

describe('Panel class:', function() {
  describe('data property', function() {
    var p = new Panel();
    
    it('sets data', function() {
      var data = 'data';
      p.data = data;
      expect(p.data).toBe(data);
    });

  });

});
