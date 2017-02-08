/**
 * @module errorObjects
 * @desc Custom error objects for use in application
 */

/**
 * @class GroupedChartError
 * @param {String} chartname - index for chart that was not avialable
 */
export function GroupedChartError(chartname) {
  this.name = "GroupedChartError";
  this.message = `Error attempting to access ${chartname}. Chart does not exist`; 
}

GroupedChartError.prototype = Object.create(Error.prototype);
GroupedChartError.prototype.constructor = GroupedChartError;

/**
 * @class ValidationError
 * @param objectName {String} objectName - type of object that could not be validated
 */
export function ValidationError(objectName) {
  this.name = "ValidationError";
  this.message = `Could not validate object of type ${objectName}`; 
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

