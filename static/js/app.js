
var selector = d3.select("#selDataset");



const sample_url = 'https://127.0.0.1/sample';
const metadata_url = 'https://127.0.0.1/metadata';


function buildMetadata(sample) {

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);

  let metadataTag = d3.select('#sample-metadata')  

  metadataTag.html('')

  d3.json('/metadata/' + sample).then((metaData) => {
    
    Object.entries(metaData).forEach(function ([key, value]){
      metadataTag.append('li').text(key.charAt(0) + key.slice(1).toLowerCase() + ': ' + value)})})}






function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  d3.json('/samples/940')
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");


  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

console.log('hello world')
// selector.on('change', optionChanged(this.value))
