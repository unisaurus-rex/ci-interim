/***** jspm packages *****/
import jquery from 'jquery';
import bootstrap from 'bootstrap-sass';

/***** local packages *****/
import {getInsightsData} from 'model';

console.log(getInsightsData("sig_credit"));
console.log(getInsightsData("sig_debit", "All Issuers"));
