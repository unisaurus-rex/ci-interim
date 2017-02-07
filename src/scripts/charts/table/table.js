import * as d3 from "d3";

export default function tableChart() {


  function buildTable(container, data) {
    
    // declare variables for Table Head and Body
    var thead = container.select("thead");
    var tbody = container.select("tbody");

    /***** Add header elements ******/
    var thRowUpdate = thead.selectAll("tr").data([data.headers]);

    var thRow = thRowUpdate.enter()
        .append("tr")
        .merge(thRowUpdate);

    // using es6 anonymouse function notation in .data()
    var thCells = thRow.selectAll("th").data( (d) => {return d;} );

    thCells.exit().remove();

    thCells.enter()
      .append("th")
      .merge(thCells)
    // using es6 anonymouse function notation in .text()
      .text( (d) => {return d;} )
      .style("opacity", 0)
      .transition()
      .delay(1500)
      .style("opacity", 1);

    /***** create a row for each object in the data *****/
    // mapping function from data ro td based on columns
    // row is an object with keys = data.columns
    // build array of objects for each key in row
    function rowData(row) {
      return data.columns.map(function (column) {
        return { column: column, value: row[column] }; }); }

    var bodyRowsUpdate = tbody.selectAll("tr")
        .data(data);

    var bodyRows = bodyRowsUpdate.enter()
        .append("tr") 
        .merge(bodyRowsUpdate);

    var bodyCells = bodyRows.selectAll("td")
        .data(rowData);

    bodyCells.exit().remove();

    bodyCells.enter()
      .append("td")
      .merge(bodyCells)
      .text( (d) => {return d.value;} )
      .style("opacity", 0)
      .transition()
      .delay(1500)
      .style("opacity", 1);
  }

  return buildTable; 

} 
