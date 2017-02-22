import {exportObj as groupStackModel} from 'groupStackModel';
import {InvalidChartError, DuplicateChartError} from 'errorObjects';

describe('Grouped Bar Model', function() {
  describe('error creation', function() {
    let invalidName = "#blerg"; // invalid chartname
    let re = new RegExp(invalidName); // regular expression for checking error message

    describe('add checkboxes', function() {
      
      let f = function() {
        groupStackModel.addCheckboxes(invalidName, [], [])
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
        groupStackModel.getAllCheckboxes(invalidName)
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
        groupStackModel.getAllChecked(invalidName)
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
        groupStackModel.getCheckboxValue(invalidName, "name")
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
        groupStackModel.checkAll(invalidName)
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
        groupStackModel.toggle(invalidName, "name");
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
        groupStackModel.setSvgSize(invalidName, {width: 100, height: 100});
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
        groupStackModel.getSvgSize(invalidName);
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
        groupStackModel.setMargins(invalidName, {left: 40, right: 40, top: 40, bottom: 40});
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
        groupStackModel.getMargins(invalidName);
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
        groupStackModel.getResetCount(invalidName);
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
        groupStackModel.setData(invalidName, {});
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
        groupStackModel.getData(invalidName);
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
        groupStackModel.setDropdown(invalidName, "value");
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
        groupStackModel.getDropdown(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('getDropdownChanged', function() {
      
      let f = function() {
        groupStackModel.getDropdownChanged(invalidName);
      };
      
      it('throws InvalidChartError', function() {
        expect(f).toThrowError(InvalidChartError);
      });

      it('the error message contains the chartname', function() {
        expect(f).toThrowError(re);
      });

    });

    describe('setDropdownChanged', function() {
      
      let f = function() {
        groupStackModel.setDropdownChanged(invalidName);
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
      groupStackModel.addGroupStack(chartname);
    }

    groupStackModel.addGroupStack(chartname);

    it('throws DuplicateChartError', function() {
      expect(f).toThrowError(DuplicateChartError);
    });

    it('the error message contains the chartname', function() {
      expect(f).toThrowError(re);
    });

  });

});