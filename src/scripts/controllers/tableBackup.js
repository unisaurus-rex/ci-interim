/** 
 * @function addDropdownListener
 * @param {String} chartname - css selector for chart
 */
function addDropdownListener(chartname) {
  // don't add listener if chart doesn't exist
  if(tables.hasOwnProperty(chartname)){
    // add listener
    let selector = chartname + " .dropdown-menu li a";
    let cb = dropdownCallbackBuilder(chartname);
    //"click.mine" prevents previous event listeners from being overwritten
    d3.selectAll(selector).on('click.mine', cb);
  } else {
    throw new Error("Attempt to add dropdown listener for non-existent table panel object");
  }
}

/***** Private Functions *****/
// this var for exporting functions to be tested only, not intended to be used in code
export var testing = {
  uniqueMccNames: uniqueMccNames,
  buildTableData: buildTableData
};



/**
 * @function dropdownCallbackBuilder
 * @param {String} chartname - css selector for chart
 */
function dropdownCallbackBuilder(chartname) {
  return function(d) {
    // get selected dropdown value
    let val = d3.select(this).attr('data-value');

    // set dropdown value
    setDropdown(chartname, val);
    
    // draw table
    draw(chartname);
  }
}




