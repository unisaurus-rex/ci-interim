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
	width = width - margin.left- margin.right;
	height = height - margin.top-margin.bottom;

	x
	.rangeRound([0,height]);
	
	y
		.rangeRound([width,0])
		.domain([0, d3.max(data, function(d) { return d.total; })]).nice()
	;
	
	y2
		.rangeRound([0,width])
		.domain([0, d3.max(data, function(d) { return d.total; })]).nice()
	;

	var stack = d3.stack();
 
  	z.domain(data.columns.slice(1));
  
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
	var transformY = height- (height /4);


	g.selectAll(".serie")
	.data(stack.keys(data.columns.slice(0))(data))
	.enter().append("g")
	  .attr("transform", "translate(0," + transformY + ")")
	  .attr("class", classMapFunction)
	.selectAll("rect")
	.data(function(d) { return d; })
	.enter().append("rect")
	  .attr("y", function(d) { return -height/2; })
	  .attr("x", function(d) {   return y2(d[0]); })
	  .attr("width", function(d) { return y(d[0]) - y(d[1]); })
	  .attr("height", height/2);

  	var xaxis = d3.axisRight(x)
  		.tickSize(0)
  		.ticks(0)
  	;

	g.append("g")
		.attr("class", "axis axis--x")
	  	.attr("transform", "translate(0," + 0+ ")")
	  	.call(xaxis)
  	;

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(
			d3.axisBottom(y2)
		  	.ticks(4, "%")
		)
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