import {exportObj as tableModel} from 'tableModel';
import {DuplicateChartError, InvalidChartError} from 'errorObjects';

describe('tableModel:', function() {
  describe('addTable error handling', function() {
    // setup
    let chartname = '#testchart';
    let re = new RegExp(chartname);

    let f = function() {
      tableModel.addTable(chartname);
    }

    // add a table so we can get a duplicate error
    tableModel.addTable(chartname);

    it('throws an DuplicateChartError if user attempts to add an existing chartname', function() {
      expect(f).toThrowError(DuplicateChartError);
    });

    it('the error message contains the chartname', function() {
      expect(f).toThrowError(re);
    });
  });

  describe('setData error handling', function() {
    let chartname = "fakechart";
    let re = new RegExp(chartname);

    let f = function() {
      tableModel.setData(chartname, "data");
    }

    it('throws an InvalidChartError if the chartname does not exist', function() {
      expect(f).toThrowError(InvalidChartError);
    });

    it('the error message contains the chartname', function() {
      expect(f).toThrowError(re);
    });

  });

  describe('setDropdown error handling', function() {
    let chartname = "fakechart";
    let re = new RegExp(chartname);
    let f = function() {
      tableModel.setDropdown(chartname, "data");
    }

    it('throws an InvalidChartError if the chartname does not exist', function() {
      expect(f).toThrowError(InvalidChartError);
    });

    it('the error message contains the chartname', function() {
      expect(f).toThrowError(re);
    });  });
  
});
