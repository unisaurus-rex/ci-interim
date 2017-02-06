import {tableModel} from 'tableModel';

describe('tableModel:', function() {
  describe('addTable error handling', function() {
    // setup
    let chartname = 'testchart';
    let err;

    tableModel.addTable(chartname);
    try {
      tableModel.addTable(chartname);
    }
    catch(e) {
      err = e;
    }

    it('throws an error if user attempts to add an existing chartname', function() {
      expect(err).toBeDefined();
    });

    it('the error message is not empty', function() {
      expect(err.message.length).toBeGreaterThan(0);
    });
  });

  describe('setData error handling', function() {
    let chartname = "fakechart";
    let err;

    try {
      tableModel.setData(chartname, "data");
    }
    catch(e) {
      err = e;
    }
    it('throws an error if the chartname does not exist', function() {
      expect(err).toBeDefined();
    });
    it('the error message is not empty', function() {
      expect(err.message.length).toBeGreaterThan(0);
    });
  });

  describe('setDropdown error handling', function() {
    let chartname = "fakechart";
    let err;

    try {
      tableModel.setDropdown(chartname, "data");
    }
    catch(e) {
      err = e;
    }
    it('throws an error if the chartname does not exist', function() {
      expect(err).toBeDefined();
    });
    it('the error message is not empty', function() {
      expect(err.message.length).toBeGreaterThan(0);
    });
  });
  
});
