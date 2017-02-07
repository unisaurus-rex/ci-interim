import {exportObj as groupedModel} from 'groupedBarModel';
import {GroupedChartError} from 'errorObjects';

describe('Grouped Bar Model', function() {
  describe('error creation', function() {
    var invalidName = "#blerg"; // invalid chartname
    var re = new RegExp(invalidName); // regular expression for checking error message

    describe('add checkboxes', function() {
      
      var f = function() {
        groupedModel.addCheckboxes(invalidName, [], [])
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('get all checkboxes', function() {
      
      var f = function() {
        groupedModel.getAllCheckboxes(invalidName)
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('get all checked', function() {
      
      var f = function() {
        groupedModel.getAllChecked(invalidName)
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('get checkbox value', function() {
      
      var f = function() {
        groupedModel.getCheckboxValue(invalidName, "name")
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('check all', function() {
      
      var f = function() {
        groupedModel.checkAll(invalidName)
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('toggle', function() {
      
      var f = function() {
        groupedModel.toggle(invalidName, "name")
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

  });
});
