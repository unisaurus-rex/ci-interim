import * as d3 from "d3";

export default function groupedBarChart(){

var width = 0;
var height = 0;
var classMap =  {};
var classMapFunction = function (d){
  return classMap[ d.name ];
}
var x0;
var x1;
var y;
var groupRangeFunction;

function chart(svg, data){
  window.d3 = d3;

  // group of bars
  var issuer = svg.selectAll(".issuer")
    .data(data);


  var enterAndUpdate = 
    issuer.enter().append("g")
    .merge(issuer)
    .attr("class", "issuer")
    .attr("transform", groupRangeFunction)
  ;

  // draw each individual bar
  var sel = enterAndUpdate.selectAll("rect")
  .data(function(d) { return d.groups; }, (d)=> d.name);
    
    
    sel
    .enter().append("rect")
    .attr("y", height)
    .merge(sel)
        .data(function(d) { return d.groups; })
    .attr("width", x1.bandwidth())
    .attr("x", function(d) {  return x1(d.name); })    
    .attr("class", classMapFunction)
    .transition()
    .duration(1000)

    .attr("y", function(d) {   return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    
    //.on('mouseover', tip.show)
    //.on('mouseout', tip.hide)
  ;

  sel.exit()
    .transition()
    .duration(1000)
    .attr("height", 0)
    .attr("y", function(d) {return height})

    .remove();
}

  chart.width = function(value){
    if (!arguments.length) return width;
    width = value;
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
  chart.x0 = function(value){
    if (!arguments.length) return x0;
    x0 = value;
    return chart;
  }
  chart.x1 = function(value){
    if (!arguments.length) return x1;
    x1 = value;
    return chart;
  }

  chart.y = function(value){
    if (!arguments.length) return y;
    y = value;
    return chart;
  }

  chart.groupRangeFunction = function(value){
    if (!arguments.length) return groupRangeFunction;
    groupRangeFunction = value;
    return chart;
  }

  return chart;
}