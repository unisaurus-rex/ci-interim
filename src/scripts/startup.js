/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';

/***** local packages *****/
import {getInsightsData} from 'model';
import addBootstrapCheckboxObservers from 'checkboxObserver';

// console.log(getInsightsData("sig_credit"));
// console.log(getInsightsData("sig_debit", "All Issuers"));

// add observers
var ids = ['box1', 'box2'];
var vals = ['trex', 'smellicorn'];
var defaults = [true, true];

// function to execute when a change happens
var cback = (arr) => {
  if(arr.length) {
    console.log('these boxes are checked: ' + arr.toString() );
  } else {
    console.log('nothing is checked');
  }
};

addBootstrapCheckboxObservers(ids, vals, defaults, cback);
