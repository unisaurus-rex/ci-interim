/**
 * @module checkboxes
 */

/** Track a group of checkboxes and their state (checked or unchecked) */
export default class Checkboxes {
  /**
   * Create a group of checkboxes, one for each name in namesArr. If valuesArr is not provided, each checkbox value defaults to false
   * @param {string[]} namesArr - the name of each checkbox you want to track
   * @param {bool[]} [valuesArr] - the starting value of each checkbox in nameArr, true means the checkbox is checked
   */
  constructor(namesArr, valuesArr){
    // Case 1: only namesArr passed as argument, initialize checkbox properties to false by default
    if(arguments.length == 1) {
      this.checkboxes = namesArr.reduce( (result, val) => {
        result[val] = false;
        return result;
      }, {});
    } else if (arguments.length == 2) {
      // case 2: namesArr and valuesArr provided
      // use valuesArr to set starting value of each checkbox
      this.checkboxes = namesArr.reduce( (result, val, idx) => {
        result[val] = valuesArr[idx];
        return result;
      }, {});
    } else {
      // case 3: throw an error 
      throw new Error('Attempted to instantiate Checkboxes class with no parameters');
    }

  }

  /**
   * Return an object containing all checkbox names and values
   */
  getAll() {
    return this.checkboxes;
  }

  /**
   * return an array of all properties whose value is true
   */ 
  getAllChecked() {
    // get array of checkbox names
    let keys = Object.keys(this.checkboxes);
    let c = this.checkboxes

    // go through each checkbox name and drop any that don't have a value of true 
    return keys.filter( (key) => {
      return c[key];
    });
  }

  /**
   * Return the value belonging to the checkbox associated with name
   * @param {string} name - name of the checkbox
   */
  getValue(name) {
    return this.checkboxes[name];
  }

  /**
   * Set all checkbox values to true
   */
  checkAll() {
    let keys = Object.keys(this.checkboxes);
    keys.forEach( (k) => {this.checkboxes[k] = true;});
  }

  /**
   * Flip the value of the checkbox associated with name
   * @param {string} name - name of the checkbox
   * @returns {array}
   */
  toggle(name) {
    this.checkboxes[name] = !this.checkboxes[name];
    return this.getAllChecked();
  }

}

