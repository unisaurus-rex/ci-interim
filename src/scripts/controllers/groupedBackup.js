

//
function updateDropdownText( chartname, text ){
  //console.log (chartname, text);
  let selection = chartname + " button";
  let button = d3.select( selection );
  button._groups[0][0].innerHTML = text +  "<span class='caret'> </span>";
}

function updatePanelTitle( chartname, text){
  let selection = chartname + " h2";
  let title = d3.select(selection);
  //console.log( d3.select (title._groups[0][0]).attr("data-value") );

  title._groups[0][0].innerText = d3.select (title._groups[0][0]).attr("data-value") + ": "+ text;

}



