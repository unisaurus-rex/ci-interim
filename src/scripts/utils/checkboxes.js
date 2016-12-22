/**
 * @module checkboxes
 */

/** Track a group of checkboxes and their state (checked or unchecked) */
export class Checkboxes {
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
   * Flip the value of the checkbox associated with name
   * @param {string} name - name of the checkbox
   * @returns {array}
   */
  toggle(name) {
    this.checkboxes[name] = !this.checkboxes[name];
    return this.getAllChecked();
  }

}

/*
 * @function addObserver
 * @param el {DOM Node} a dom element 
 * @param callback {function} a function to execute when a checkbox is checked or
 *        unchecked.  The function will receive no arguments.
 * @description execute a callback function when a bootstrap checkbox is checked
 *              or unchecked
 */
export function addCheckboxObserver(el, callback) {
  // wrap the callback so it can be used if the mutation alters the checkbox
  var mutationFunc = mutationFuncBuilder(callback);
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(mutationFunc);
  });

  // mutation observer config object, use oldValue: true so we can compare current value to old value
  // otherwise we won't be able to tell if the active value changed
  var config = {attributes: true, attributeOldValue: true, attributeFilter: ['class']};

  // apply the observer to el
  observer.observe(el, config);
}

/**
 * Return a function that can be called by mutation observer
 * @function mutationFuncBuilder
 * @param {function} callback - function that takes a checkbox value 
 */
function mutationFuncBuilder(callback) {
  return function(mutation) {
    /* mutation will track the old and new value, two cases that we care about
       1) added active class to the label
       2) removed active class from the label
       mutation will fire anytime a class is added or removed, the class may or may
       not be the active class that signals a checkbox click
       so we check to see if the active class is the class that changed betwee old and new
    */
    var newHasActive = mutation.target.classList.contains('active');
    var oldHasActive = mutation.oldValue.includes('active');
    if( (newHasActive && !oldHasActive) || (oldHasActive && !newHasActive) ){
      var elArr =  mutation.target.getElementsByTagName('input');
      if(elArr.length) {
        var inputEl = elArr[0];
        callback(inputEl.value);
      }
    }
  }
}

/* Notes
One function to add observers for every checkbox
function addObservers(elementIds, value attribute of each element, default value of each value(true or false), callback(takes array of strings for each checked item)
// this builds a callback that can be passed to mutation observer
{
CallbackBuilder(value, defaults, callback) {
new Checkboxes (values, defaults)
function(checkboxes, callback) {
  return function(value){
    callback(checkboxes.toggle(value));
}}
}
}

// for each id in id array, build new mutation observer with id and callback
*/
