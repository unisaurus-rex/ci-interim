/**
 * @module errorObjects
 * @desc Custom error objects for use in application
 */

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

/**
 * @class DuplicateChartError 
 * @param objectName {String} objectName - type of object that could not be validated
 */
export function DuplicateChartError(objectName) {
  this.name = "DuplicateChartError";
  this.message = `Attempt to create chart using duplicate index: ${objectName}`; 
}

DuplicateChartError.prototype = Object.create(Error.prototype);
DuplicateChartError.prototype.constructor = DuplicateChartError;

/**
 * @class InvalidChartError
 * @param {String} chartname - index for chart that was not avialable
 */
export function InvalidChartError(chartname) {
  this.name = "InvalidChartError";
  this.message = `Error attempting to access ${chartname}. Chart does not exist`; 
}

InvalidChartError.prototype = Object.create(Error.prototype);
InvalidChartError.prototype.constructor = InvalidChartError;

