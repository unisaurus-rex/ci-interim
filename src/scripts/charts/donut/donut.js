import * as d3 from "d3";

export default function donutChart(){
  var width = 500,
  height = 500,
  innerText = "TOTAL TRANS";
  var radius = Math.min( width, height) / 2;
  var innerRad = radius / 4;
  var hoverRad = 15;
  var padAngle = 0;
  var column;
 
  var constancyFunction = function(d){
    return d.transactionType;
  }
  var classMap = {"declines": "fill-danger", "authorizations": "fill-success", "chargebacks":"fill-warning"};
  var classMapFunction= function(d) {
    return classMap[d.data.transactionType];
  }

  var innerNumberFunc;

  function chart(container, dataArr){
    //remove current number
    container.select( "text.data" )
      .transition()
      .duration(100)
      .style("opacity", 0)
      .remove()
    ;

    var innerNumber = innerNumberFunc(dataArr, column);
    var formatNum = d3.format(',.2f');
    innerNumber = formatNum(innerNumber);

    //update number
    container.append("text")
      .attr("dy", ".95em")
      .style("text-anchor", "middle")
      .style("opacity", 0)
      .attr("class", "data")
      .text(function(d) {
        return innerNumber;
      })
      .transition()
      .duration(1000)
      .style("opacity", 1)
    ;
    
    //remove and add inner text
    container.selectAll ("text.inside")
      .remove()
    ;
    container.append("text")
      .attr("dy", "-0.5em")
      .style("text-anchor", "middle")
      .attr("class", "inside")
      .text(function() {
        return innerText;
      })
    ;
    
    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - innerRad)
    ;

    var hoverArc = d3.arc()
      .outerRadius(radius - innerRad)
      .innerRadius(radius + hoverRad)
    ;

    var pie = d3.pie()
      .sort(null)
      .value ( function (d) { return d [column] })
      .padAngle(padAngle)
    ;

    var sel = container.selectAll("path")
      .data(pie(dataArr), constancyFunction)
    ;

    sel
      .data(pie(dataArr))
      .enter()
      .append("path")

      .attr("title", function(d){ return d.data.mcc_name + " " + d.value;})
      .on("mouseover", function(d) {
            d3.select(this)
              .transition()
                .duration(1000)
                .attr("d", hoverArc)    
            ;
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .transition()
                .duration(1000)
                .attr("d", arc)
              ;
                
        })
      .merge(sel)
      .data(pie(dataArr))
      
        .attr("class", classMapFunction)
        .attr("pointer-events", "none")
        .transition()
        .duration(700)
        //.attr("opacity", 1)
        .attrTween('d', function(d) {
        var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function(t) {
            return arc(interpolate(t));
        }})
        .on("end", function(){ d3.select(this).attr("pointer-events", null) })
      ;

        sel.exit()
          .attr("pointer-events", "none")
          .transition()
          .duration(700)
          .attrTween('d', function(d) {
        var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function(t) {
            return arc(interpolate(t));
        }})
          .style("opacity", 0)
          .remove()
      ;

    function arcTween(a) {
      var startAngle = a.startAngle; //<-- keep reference to start angle
      var i = d3.interpolate(a.startAngle, a.endAngle, a); //<-- interpolate start to end
      return function(t) {
          return arc({ //<-- return arc at each iteration from start to interpolate end
            startAngle: startAngle,
            endAngle: i(t),
          });
      };
    }


  }

  chart.width = function(value){
    if (!arguments.length) return width;

    if(value != null) {
      width = value;
    }

    return chart;
  }

  chart.height = function(value){
    if (!arguments.length) return height;

    if(value != null) {
      height = value; 
    }

    return chart; 
  }

  chart.innerText = function(value){
    if (!arguments.length) return innerText;

    if(value != null) {
      innerText = value;
    }
    
    return chart; 
  }
  
  chart.innerRad = function(value){
    if (!arguments.length) return innerRad;

    if(value != null) {
      innerRad = value;
    }
    
    return chart; 
  }

  chart.hoverRad = function(value){
    if (!arguments.length) return hoverRad;

    if(value != null) {
      hoverRad = value;
    }
    
    return chart; 
  }
  chart.padAngle = function(value){
    if (!arguments.length) return padAngle;

    if(value != null) {
      padAngle = value;
    }
    
    return chart; 
  }

  chart.constancyFunction = function(value){
    if (!arguments.length) return constancyFunction;

    if(value != null) {
      constancyFunction = value; 
    }
    
    return chart;
  }

  chart.classMap = function(value){
    if (!arguments.length) return classMap;

    if(value != null) {
      classMap = value;
    }
    
    return chart;
  }

  chart.classMapFunction = function(value){
    if(!arguments.length) return classMapFunction;

    if(value != null) {
      classMapFunction = value;
    }
    
    return chart;
  }



  chart.innerNumberFunc = function (value){
    if(!arguments.length) return innerNumberFunc;

    if(value != null) {
      innerNumberFunc = value;
    }
    
    return chart; 
  }
  chart.column = function (value){
    if(!arguments.length) return column;

    if(value != null) {
      column = value;
    }
    
    return chart; 
  }

  return chart;
}
