export default class Checkboxes {
  // namesArr: array of strings
  // [Optional]  valuesArr: array of bools corresponding to each value in namesArr
  constructor(namesArr, valuesArr){
    // only namesArr passed as argument
    // initialize checkbox properties to false by default
    if(arguments.length == 1) {
      this.checkboxes = namesArr.reduce( (result, val) => {
        result[val] = false;
      }, {}):
    } else if (arguments.length == 2) {
      // use valuesArr to set starting value of each checkbox
      this.checkboxes = namesArr.reduce( (result, val, idx) => {
        result[val] = valuesArr[idx];
      }, {});
    } else {
      this.checkboxes = {};
    }

  }

  // return all checkbox names and values as an object
  getAll() {
    return this.checkboxes;
  }

  // return an array of all properties whose value is true
  getAllChecked() {
    // get array of checkbox names
    let keys = Object.keys(this.checkboxes);
    let c = this.checkboxes

    // go through each checkbox name and drop any that don't have a value of true 
    return keys.filter( (key) => {
      return c[key];
    });
  }

  getValue(name) {
    return this.checkboxes[name];
  }

  toggle(name) {
    this.checkboxes[name] = !this.checkboxes[name];
  }

}
