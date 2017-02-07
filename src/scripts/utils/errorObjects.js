/**
 * @module errorObjects
 * @desc Custom error objects for use in application
 */

export function GroupedChartError(chartname) {
  this.name = "GroupedChartError";
  this.message = `Error attempting to access ${chartname}. Chart does not exist`; 
}

GroupedChartError.prototype = Object.create(Error.prototype);
GroupedChartError.prototype.constructor = GroupedChartError;
