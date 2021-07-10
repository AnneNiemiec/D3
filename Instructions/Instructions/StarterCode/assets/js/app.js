
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("class", "xText");
  
  // Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthcareData, err) {
    if (err) throw err;
  
    // parse data
    healthcareData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

  // function used for updating x-scale var upon click on axis label
function xScale(healthcareData) {
  
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthcareData, d => d.poverty) * 0.8,
      d3.max(healthcareData, d => d.poverty) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
    // xLinearScale function above csv import
    var xLinearScale = xScale(healthcareData);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthcareData, d => d.healthcare)])
      .range([height, 0]);
  
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append circles
      chartGroup.selectAll("circle")
      .data(healthcareData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 20)
      .attr("fill", "pink")
      .attr("opacity", ".5");

    // append text
      chartGroup.selectAll("text")
      .data(healthcareData)
      .enter()
      .append("text")
      //.merge(circlesGroup)
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+5)
      .attr("font-size", "8px");

      // append g
      chartGroup.append("g")
      .classed('axis', true)
      .call(leftAxis);

      // append g
      chartGroup.append("g")
      .classed('axis', true)
      .call(bottomAxis);
     //format text here!!


})
