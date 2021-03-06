
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 100,
  right: 100,
  bottom: 100,
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
  .attr("class", "xText")
  .attr("transform", `translate(${margin.left},0)`);
  
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
      .domain([0, d3.max(healthcareData, d => d.healthcare)+5])
      .range([height, 0]);
  
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append circles
      var circlesGrid=chartGroup.selectAll("circle")
      .data(healthcareData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 8)
      .attr("fill", "lightblue")
      .attr("opacity", "1.25")
      .classed("healthcareCircle",true);

    // append text
      chartGroup.selectAll("text")
      .data(healthcareData)
      .enter()
      .append("text")
      .text (function(d) {return d.abbr})
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+5)
      .attr("font-size", "8px")
      .attr("fill", "white")
      .attr("class", "stateText");

      // append g (left)
      chartGroup.append("g")
      .classed('axis', true)
      .style("font-size", "12px")
      // .attr("transform", `translate(${100},0)`)
      .call(leftAxis);

      // append g (bottom)
      chartGroup.append("g")
      .classed('axis', true)
      .attr("transform", `translate(0,${height})`)
      .call(bottomAxis);

      //labels 
      //**(assistance from instructor and Bitty (cohort) during office hours)

      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left +50)
      .attr("x", 0 - (height / 2))
      .style("text-anchor", "middle")
      .attr("dy","1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

      chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + 35})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  })
