/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';

/***** local packages *****/
import {getInsightsData} from 'model';
import {Checkboxes, addCheckboxObserver, mutationFuncBuilder} from 'checkboxes';

// console.log(getInsightsData("sig_credit"));
// console.log(getInsightsData("sig_debit", "All Issuers"));

//initiatlize checkboxes
var cboxes = new Checkboxes(['test'], [true]);
// get checkbox element to observe
var cboxEl = document.getElementById('cboxTest');
// function to execute when a change happens
var cback = (value) => {
  let checkedArr = cboxes.toggle(value);
  if(checkedArr.length) {
    console.log('box is checked');
  } else {
    console.log('box is not checked');
  }
};

addCheckboxObserver(cboxEl, cback);
