import {exportObj as groupedModel} from 'groupedBarModel';
import {InvalidChartError, DuplicateChartError} from 'errorObjects';

describe('Grouped Bar Model', function() {
  describe('error creation', function() {
    let invalidName = "#blerg"; // invalid chartname
    let re = new RegExp(invalidName); // regular expression for checking error message

    describe('add checkboxes', function() {
      
      let f = function() {
        groupedModel.addCheckboxes(invalidName, [], [])
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('get all checkboxes', function() {
      
      let f = function() {
        groupedModel.getAllCheckboxes(invalidName)
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('get all checked', function() {
      
      let f = function() {
        groupedModel.getAllChecked(invalidName)
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('get checkbox value', function() {
      
      let f = function() {
        groupedModel.getCheckboxValue(invalidName, "name")
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('check all', function() {
      
      let f = function() {
        groupedModel.checkAll(invalidName)
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('toggle', function() {
      
      let f = function() {
        groupedModel.toggle(invalidName, "name");
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('set svg size', function() {
      
      let f = function() {
        groupedModel.setSvgSize(invalidName, {width: 100, height: 100});
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getSvgSize', function() {
      
      let f = function() {
        groupedModel.getSvgSize(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setMargins', function() {
      
      let f = function() {
        groupedModel.setMargins(invalidName, {left: 40, right: 40, top: 40, bottom: 40});
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getMargins', function() {
      
      let f = function() {
        groupedModel.getMargins(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getResetCount', function() {
      
      let f = function() {
        groupedModel.getResetCount(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setData', function() {
      
      let f = function() {
        groupedModel.setData(invalidName, {});
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getData', function() {
      
      let f = function() {
        groupedModel.getData(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setDropdown', function() {
      
      let f = function() {
        groupedModel.setDropdown(invalidName, "value");
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getDropdown', function() {
      
      let f = function() {
        groupedModel.getDropdown(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

  });

  describe('addGroupedBar', function() {
    let chartname = "#bleh";
    let re = new RegExp(chartname);
    let f = function() {
      groupedModel.addGroupedBar(chartname);
    }

    groupedModel.addGroupedBar(chartname);

    it('throws DuplicateChartError', function() {
      expect(f).toThrowError(DuplicateChartError);
    });

    it('the error message contains the chartname', function() {
      expect(f).toThrowError(re);
    });

  });

});
