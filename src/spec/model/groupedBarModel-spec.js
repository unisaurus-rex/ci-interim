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
        groupedModel.toggle(invalidName, "name");
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('set svg size', function() {
      
      var f = function() {
        groupedModel.setSvgSize(invalidName, {width: 100, height: 100});
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getSvgSize', function() {
      
      var f = function() {
        groupedModel.getSvgSize(invalidName);
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setMargins', function() {
      
      var f = function() {
        groupedModel.setMargins(invalidName, {left: 40, right: 40, top: 40, bottom: 40});
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getMargins', function() {
      
      var f = function() {
        groupedModel.getMargins(invalidName);
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getResetCount', function() {
      
      var f = function() {
        groupedModel.getResetCount(invalidName);
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setData', function() {
      
      var f = function() {
        groupedModel.setData(invalidName, {});
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getData', function() {
      
      var f = function() {
        groupedModel.getData(invalidName);
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setDropdown', function() {
      
      var f = function() {
        groupedModel.setDropdown(invalidName, "value");
      };
      
      it('throws GroupedChartError', function() {
        expect(f).toThrowError(GroupedChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getDropdown', function() {
      
      var f = function() {
        groupedModel.getDropdown(invalidName);
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
