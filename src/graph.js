import * as d3 from 'd3';

export default function renderGraph(data){
  var width = 1000;
  var height = 800;
  var padding = 50;

  var keys = Object.keys(data);
  var meta = data[keys[0]]; // Unused for now
  var stock = data[keys[1]];

  // NOTE: The actual stock data has the date as the index, which is slightly annoying.
  var dates = Object.keys(stock);
  var prices = Object.values(stock);

  var graph = d3.select('#output')
  .append('svg')
  .attr('id', 'graph')
  .attr('width', width)
  .attr('height', height);
  
  // X-axis
  var xScale = d3.scaleTime()
  .domain([d3.min(dates, (d) => new Date(d)), d3.max(dates, (d) => new Date(d))])
  .range([padding, width - padding]);

  var xAxis = d3.axisBottom(xScale);

  graph.append('g')
  .attr('transform', `translate(0, ${height - padding})`)
  .call(xAxis);

  // Y-axis
  var yScale = d3.scaleLinear()
  .domain([d3.min(prices, (d) => Number(d['4. close'])), d3.max(prices, (d) => Number(d['4. close']))])
  .range([height-padding, padding]);

  var yAxis = d3.axisLeft(yScale);

  graph.append('g')
  .attr('id', 'y-axis')
  .attr('transform', `translate(${padding}, 0)`)
  .call(yAxis);
}