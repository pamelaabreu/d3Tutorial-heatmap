const svg = d3.select("svg");

// Save the height to fit in the data
svg.attr("width", 800).attr("height", data.length * 150);

// Create a group so we can append dataPoints information like city and country
const dataPoints = svg
  .selectAll("g.data-point")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "data-point")
  .attr("transform", (_d, i) => `translate(0, ${i * 150})`);

// City info
dataPoints
  .append("text")
  .attr("x", 175)
  .attr("y", 70)
  .attr("class", "city")
  .text((d) => d.city);

// Country info
dataPoints
  .append("text")
  .attr("x", 175)
  .attr("y", 100)
  .attr("class", "country")
  .text((d) => d.country);

// Create celsius color range
const celsiusScaleRange = [-10, 0, 7, 14, 21, 25];
// const celsiusColorsScaleRange = celsiusScaleRange.map(deg => `var(--${deg === -10 ? 'negC10' : 'C' + deg})`);

const colorScale = d3
  .scaleLinear()
  .domain(celsiusScaleRange)
  .range(["#814ee7", "#814ee7", "#79e87C", "#fbe157", "#ff9737", "#fe3b3b"]);
/**
 * TODO: Investigate why the fill is using the actual data point from months and replacing var
 * e.g. if a month data point is 5 -> the fill will be var(--C5) instead of finding a color range between C0 and C7
 */
// .range(celsiusColorsScaleRange)

// Create temp position range
const boxScale = d3.scaleLinear().domain([-20, 45]).range([150, 0]);

// Create a group so we can append graph data
const months = dataPoints
  .append("g")
  .attr("class", "months")
  .attr("transform", "translate(200, 0)");

// This will create the month group
// We use the months key from the data
const monthGroups = months
  .selectAll("g.month")
  .data((d) => d.months)
  .enter()
  .append("g")
  .attr("class", "month")
  .attr("transform", (_d, i) => `translate(${i * 50}, 0)`);

// This will create each indivdual month
monthGroups
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 50)
  .attr("height", 150)
  .style("fill", (d) => colorScale(d));

// This will create and append the month data circle
// We use boxScale to set the y position of the circle
monthGroups
  .append("circle")
  .attr("cx", 25)
  .attr("cy", (d) => boxScale(d))
  .attr("r", 15);

// Create the line we see on month graphs
// 50 comes from the month width
// 225 is the starting point, remember the month x position starts at 200
// lastly we use boxScale to set the y points along the path
const lineGenerator = d3
  .line()
  .x((_d, i) => 225 + 50 * i)
  .y((d) => boxScale(d));

// Create the month line path
// the datum fn is a way to select the month key
dataPoints
  .append("path")
  .datum((d) => d.months)
  .attr("d", (d) => lineGenerator(d));

// This will create the text to show the temp. for the month
// We use the boxScale to set the y position of the text
// We use the colorScale to make the text match the background color of the month
const temperatures = monthGroups
  .append("text")
  .attr("class", "temp")
  .attr("x", 25)
  .attr("y", (d) => boxScale(d) + 2)
  .text((d) => d)
  .style("fill", (d) => colorScale(d))
  .style("dominant-baseline", 'middle');

// Create the conversion scale for C -> F deg
const unitScale = d3.scaleLinear().domain([0, 100]).rangeRound([32, 212]);

// Give user the chance to change temp deg from C -> F
const selectTag = document.querySelector("select");

selectTag.addEventListener("input", (e) => {
  if (e.target.value === "c") {
    temperatures.text((d) => d);
  } else {
    temperatures.text((d) => unitScale(d));
  }
});
