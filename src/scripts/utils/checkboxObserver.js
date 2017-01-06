/**
 * @module checkboxObserver
 */
import Checkboxes from 'checkboxes';

/**
 * @callback changeCallback
 * @param {string[]} string values associated with the value attribute of input checkboxes
 */


/**
 * Respond to bootstrap checkboxes being checked
 * @function addBootstrapCheckboxObservers
 * @returns {function} configurable function a la Mike Bostock style
 */
export default function addBootstrapCheckboxObservers() {

  var elementIds, // array of strings, each string is the id of a label wrapping a checkbox (bootstrap checkbox style) 
      values, // array of strings, each string is the value attribute of an input checkbox
      defaults, // array of bools, the starting state of each checkbox in values, true = checked 
      callback; // changeCallback

  /**
   * Add mutation observers for each element in elementIds
   * @function observers
   * @returns {Object} Checkboxes class
   */
  function observers() {
    var boxes = new Checkboxes(values, defaults);
    
    // build the callback that is passed to addCheckboxObserver 
    var changeCallback = checkboxChangeBuilder(boxes, callback);

    // get the DOM element tied to each id
    var domEls = elementIds.map( (id) => document.getElementById(id) );

    // add observers for each item in domEls and collect the new mutation observer objects in an array so we can return it
    var observerArr = domEls.map( (el) => { return addCheckboxObserver(el, changeCallback); });  

    return observerArr;
  }

  // configuration functions (getters and setters)
  observers.elementIds = function(arr) {
    if(!arguments.length) {
      return elementIds;
    }

    elementIds = arr;
    return observers;
  };

  observers.values = function(arr) {
    if(!arguments.length) {
      return values;
    }

    values = arr;
    return observers;
  };

  observers.defaults = function(arr) {
    if(!arguments.length) {
      return defaults;
    }

    defaults = arr;
    return observers;
  };

  observers.callback = function(func) {
    if(!arguments.length) {
      return callback;
    }

    callback = func;
    return observers;
  };

  // take an array of mutation observers and disconnect each one
  observers.disconnect = function(observersArr) {
    observersArr.forEach( (obs) => {
      obs.disconnect();
    });

    return observers;
  }

  return observers;
}


/**
 * Expose a way to track checkbox toggling that can be used by other functions
 * to drive their behavior
 * @function checkboxChangeBuilder 
 * @param {Object} boxes - Checkboxes class
 * @param {changeCallback} callback  
 * @returns {function} a function that accepts a single value, this function can be passed to mutationFuncBuilder  
 */
function checkboxChangeBuilder(boxes, callback) {
  return function(value){
    callback( boxes.toggle(value) ); 
  };
}

/*
 * @function addObserver
 * @param el {DOM Node} a dom element 
 * @param callback {function} function returned by checkboxChangeBuilder
 * @description execute a callback function when a bootstrap checkbox is checkedi or unchecked
 */
function addCheckboxObserver(el, callback) {
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

  return observer;
}

/**
 * Return a function that can be called by mutation observer
 * @function mutationFuncBuilder
 * @param {function} changeCallback - function that takes a checkbox value
 * @returns {function} function that accepts a mutation record
 */
function mutationFuncBuilder(changeCallback) {
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
      // get the input element nested in the label element so we can pass its value to changeCallback
      var elArr =  mutation.target.getElementsByTagName('input');
      if(elArr.length) {
        var inputEl = elArr[0];
        changeCallback(inputEl.value);
      }
    }
  };
}
