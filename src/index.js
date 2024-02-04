import * as d3 from 'd3';
import APIKEY from './secret.json';

function renderGraph(data){
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
  .range([padding, height - padding]);

  var yAxis = d3.axisLeft(yScale);

  graph.append('g')
  .attr('id', 'y-axis')
  .attr('transform', `translate(${padding}, 0)`)
  .call(yAxis);
}

function parseForm(event){
  event.preventDefault();
  // Don't really need fancy way of storing/retrieving URL for now.
  var  APIURL = 'https://www.alphavantage.co/query?';

  // Each field has an id, so we don't really need to use event.target
  var timeSeries = document.getElementById('time-series');
  var symbol = document.getElementById('symbol'); 

  // Building API request
  // NOTE: If someone wants to run this on their own computer, they need to have their own API key.
  var requestURL = `${APIURL}function=TIME_SERIES_${timeSeries.value.toUpperCase()}&symbol=${symbol.value}&interval=15min&apikey=${APIKEY}`;

  fetch(requestURL)
  .then((res) => res.json())
  .then((data) => {
    if(data.Information){
      throw new Error('API Rate Limit');
    }
    var debug = document.getElementById('debug');
    debug.textContent = JSON.stringify(data);
    renderGraph(data);
  })
  .catch((err) => { 
    console.error(err);
    var debug = document.getElementById('debug');
    debug.textContent = "Failed to retrieve the requested resource.";
  });
}

function start(){
  var submit = document.getElementById('submit');
  submit.addEventListener('click', parseForm);
}

document.addEventListener('DOMContentLoaded', start);
