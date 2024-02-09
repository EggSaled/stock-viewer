import { drawBarGraph, drawLineGraph } from './graph.js';

function parseForm(event){
  event.preventDefault();
  // Don't really need fancy way of storing/retrieving URL for now.
  var  APIURL = 'https://www.alphavantage.co/query?';

  // Each field has an id, so we don't really need to use event.target
  var timeSeries = document.getElementById('time-series');
  var symbol = document.getElementById('symbol'); 

  // Building API request
  // NOTE: If someone wants to run this on their own computer, they need to have their own API key.
  // var requestURL = `${APIURL}function=TIME_SERIES_${timeSeries.value.toUpperCase()}&symbol=${symbol.value}&interval=15min&apikey=${APIKEY}`;

  // NOTE: Using the demo api request for now, since 25 API requests is the daily limit.
  var requestURL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo';

  fetch(requestURL)
  .then((res) => res.json())
  .then((data) => {
    if(data.Information){
      throw new Error('API Rate Limit');
    }
    var debug = document.getElementById('debug');
    debug.textContent = JSON.stringify(data);
    var graphType = document.getElementById('graph-type');
    graphType.removeAttribute('class');
    graphType.addEventListener('change', (event) => {
      var graphTypes = [ drawBarGraph, drawLineGraph ];
      var graph = document.getElementById('graph');
      if(graph){
        graph.remove();
      }
      graphTypes[event.target.value](data);
    });
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
