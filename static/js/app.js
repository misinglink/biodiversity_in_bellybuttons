const selector = d3.select("#selDataset");

const zipArrays = (array1, array2) => {
  zippedArray = array1.map(function(e, i) {
    return [e, array2[i]];
  })
  return zippedArray
}

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

  
  d3.json('/samples/' + sample).then( (samples) => {
    var bacteriaNames = []
    samples['otu_labels'].forEach( (string) => {
      
      var splitString = string.split(';')
      bacteriaNames.push(splitString[splitString.length-1])
      // bacteriaNames.push(splitString[-1])
    })
  labelValueZip = zipArrays(bacteriaNames, samples['sample_values'])

  uniqueSum = {}

  labelValueZip.forEach( (array) => {
    if (!(array[0] in uniqueSum)) {
      uniqueSum[array[0]] = array[1];
    }
    else {
      uniqueSum[array[0]] += array[1];
    }


  })

  
      var trace1 = {
      x: samples['otu_ids'],
      y: samples['sample_values'],
      mode: 'markers',
      text: bacteriaNames,
      name: 'Sample: ' + sample,
      marker: {
        color: samples['otu_ids'],
        // // opacity: [1, 0.8, 0.6, 0.4],
        size: samples['sample_values']
        
      }
    };

    var bubbleData = [trace1];
    
    var bubbleLayout = {
      title: 'Biodiversity in Bellybuttons',
      height: 700,
      xaxis: {
        title: {
          text: 'Operational taxonomic unit (OTU) ID',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
      yaxis: {
        title: {
          text: 'Bacteria Units in Thousands',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };

    var pieData = [{
      values: Object.values(uniqueSum),
      labels: Object.keys(uniqueSum),
      type: 'pie'
    }];
    
    var pieLayout = {
      height: 500,
      width: 550
    };
    
    Plotly.newPlot('pie', pieData, pieLayout)
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout,  {responsive: true})

d3.json('/metadata/' + sample).then((metaData) => {
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: metaData['WFREQ'],
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: { axis: { visible: true, range: [0, 7] } }
      }
    ];
    
    var gaugeLayout = { width: 400, height: 500, margin: { t: 0, b: 0 } };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
})

  })


}

function init() {


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

selector.on('change', optionChanged(this.value))
