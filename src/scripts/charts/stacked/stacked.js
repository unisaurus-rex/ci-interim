import * as d3 from "d3";

export default function stackChart(){

  	var margin = {top: 30, right: 40, bottom: 50, left: 40};
  	var width =0;// 900 - margin.left - margin.right;
  	var height =0;// 300 - margin.top - margin.bottom;

	var x = d3.scaleBand()
	   	// .padding(0)
	   	// .align(0)//
	;
	var y = d3.scaleLinear();
	var y2 = d3.scaleLinear();
	var z = d3.scaleOrdinal(d3.schemeCategory20);
	// stuff to pass to config
	var classMapFunction = function (d){
	  return classMap[ d.key ];
	}

	var classMap =  {"Department Store": "fill-blue", "Grocery": "fill-red",
	"Family Clothing": "fill-gray-light", "Fast Food": "fill-orange-yellow",
	"Pharmacies": "fill-teal", "All Others": "fill-gray-dark" };


function chart(svg, data){
	var ogheight = height 
	//width = width - margin.left- margin.right;
	//height = height - margin.top-margin.bottom;

	x
	.rangeRound([0,height -margin.top - margin.bottom]);
	
	y
		.rangeRound([width - margin.left - margin.right, 0])
		.domain([0, d3.max(data, function(d) { return d.total; })]).nice()
	;
	
	y2
		.rangeRound([0, width - margin.right - margin.left])
		.domain([0, d3.max(data, function(d) { return d.total; })]).nice()
	;

	var stack = d3.stack().keys(data.columns);
 
//  	z.domain(data.columns.slice(1));
  
	var gUpdate = svg.selectAll("g")
	.data( [data]);

	var g = gUpdate
	.enter()
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.merge(gUpdate)
	;
	
   
	var transformY = (height -margin.top - margin.bottom) /4;
	console.log(transformY)

	var rectUpdate = g.selectAll("rect")
	.data(stack);

	var rect = rectUpdate
	.enter().append("rect")
	.merge(rectUpdate)
	  .attr("y", height/8 )
	  .attr("class", classMapFunction)

	  .attr("height", height/2)
	  
	  .transition()
	  .duration(1000)
  	  .attr("x", function(d) {   return y2(d[0][0]); })	  
	.attr("width", function(d) { return y(d[0][0]) - y(d[0][1]); })
  	;

  	rectUpdate.exit()
  		.remove();


  	var xaxis = d3.axisRight(x)
  		.tickSize(0)
  		.ticks(0)
  	;

	g.append("g")
		.attr("class", "axis axis--x")
	  	.attr("transform", "translate(0," + 0+ ")")
	  	.call(xaxis)
  	;


var newY = height -margin.top - margin.bottom;
	g.append("g")
		.attr("transform", "translate(0," + newY+ ")")
		.call(
			d3.axisBottom(y2)
		  	.ticks(4, "%")
		)

 /* 	var rect = sel.selectAll("rect")
  		.data(function(d) { return d; })
	;

	rect
	.enter().append("rect")
	  .attr("y", function(d) { console.log (d); return -height/2; })
	  .merge( rect )
	  .attr("x", function(d) {   return y2(d[0]); })
	  .attr("width", function(d) { return y(d[0]) - y(d[1]); })
	  .attr("height", height/2)
	  ;

*/


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