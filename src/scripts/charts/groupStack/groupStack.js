
/**
 * @module stacked
 * @description Stacked chart module 
 * @requires d3
 * @exports stackChart
 */

import * as d3 from "d3";

export function stacksChart(){
  //Default Parameters
  var margin = {top: 30, right: 40, bottom: 50, left: 40};
  var width =400;// 900 - margin.left - margin.right;
  var height =150;// 300 - margin.top - margin.bottom;

  var x = d3.scaleBand();
  var y = d3.scaleLinear();

  var classMapFunction = function (d){
    return classMap[ d.key ];
  }

  var classMap = {"pin_debit": "fill-blue", "sig_credit": "fill-red",
"sig_debit": "fill-gray-dark" };

  /***********************************************************************/
  function chart(svg, data){
    console.log(data);

    //set x scale
    x
      .rangeRound([width - margin.left - margin.right, 0])
      .domain( data.map( function(d){ return d.key} ) )
      .padding(0.6)
    ;
    
    //set y scale
    y
      .rangeRound([height - margin.top - margin.bottom, 0 ])
      .domain([0, d3.max(data, function(d) { return 1; })]).nice()
    ;

    /***** AXES *****/
    //If there is currently no y axis draw one
    if (svg.selectAll(".y.axis")._groups[0].length<1){
      // y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(
          d3.axisLeft(y)
          .ticks(4, "%")
          .tickSizeInner(-width + margin.left+margin.right)
          
        )
      ;
    }

    //If there is currently no x axis draw one
    if (svg.selectAll(".x.axis")._groups[0].length < 1){
      var p = height - margin.bottom - margin.top;

      var xAxis = d3.axisBottom()
          .scale(x)
          .tickSize(0)
      ;
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+ "0"+"," +p + ")")
        .call(xAxis)
      ;  
    }

    //set data for one fi
    var fi = svg.selectAll("g.fi")
      .data(data, function(d) { return d.key;})
    ;

    //Position each stack on x axis 
    var enterAndUpdate = fi
      .enter()
        .append("g")
      .merge(fi)
        .attr("class", "fi")
        .attr("transform", function(d){ return "translate(" + x(d.key) + ",0)"} )
    ;

    //Rectangles / layers for each stack
    var stack = d3.stack().keys(data[0].groups.columns);

    var gUpdate = enterAndUpdate.selectAll("rect")
      .data( function (d) { return stack(d.groups) }, function(d){return d.key});
    
    //Draw all rectangles / layers for one stack
    gUpdate
      .enter()
        .append("rect")
        .attr("width", x.bandwidth())
        .attr("class", function(d){ return classMapFunction(d)})
      .merge(gUpdate)
        .attr("title", function(d){ return d.key + ': '+ d[0].data[d.key]})
        .transition()
        .duration(2000)
        .attr("y", function(d) { return y(d[0][1]); })   
        .attr("height", function(d) { return  y(d[0][0]) - y(d[0][1]); })
    ;

    //Remove rectangles / layers if needed
    gUpdate.exit()
      .transition()
      .duration(2000)
      .attr("height", 0)
      .attr("y", function (d ) { return y(d[0][0]); } )
      //.remove();
    ;


  }

chart.width = function(value){
  if (!arguments.length) return width;
  width = value;
  return chart;
}
chart.margin = function(value){
  if (!arguments.length) return margin;
  margin = value;
  return chart;
}
chart.height = function(value){
  if (!arguments.length) return height;
  height = value;
  return chart;
}
chart.classMap = function(value){
  if (!arguments.length) return classMap;
  classMap = value;
  return chart;
}
chart.classMapFunction = function(value){
  if(!arguments.length) return classMapFunction;
  classMapFunction = value;
  return chart;
}

  return chart;
}