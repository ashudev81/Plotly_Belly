function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
    // console.log(allSamples);
   
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = allSamples.filter(sample1 => sample1.id == sample);


    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var allMetadata = data.metadata;
    var filteredMetadata = allMetadata.filter(sample2 => sample2.id == sample);
    // console.log("metadata", filteredMetadata);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var resultSam = resultSample[0];
    // console.log(resultSam);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
     var resultWfreq = filteredMetadata[0];
    //  console.log("wfreq",resultWfreq);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sam_otu_ids = resultSam.otu_ids;
    // console.log(sam_otu_ids);
    var sam_otu_labels = resultSam.otu_labels;
    var sam_sample_values = resultSam.sample_values;
    // var sam = ['otu_id'= sam_otu_ids, 'otu_labels'= sam_otu_labels , 'sample_values' = sam_sample_values ];
    // console.log(sam.slice(0,10));

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreqData = resultWfreq.wfreq;
    wfreqData = parseFloat(wfreqData);
    // console.log(wfreqData);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = sam_otu_ids.slice(0,10).map(element=> "OTU " + element).reverse();
    // console.log(yticks);

    var trace1 = {
      x: sam_sample_values.slice(0,10).reverse(),
      y: yticks,
      text: sam_otu_labels.slice(0,10),
      name: "OTU Labels",
      type: "bar",
      orientation: "h"
    }

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [ trace1];

    // ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found",
      height: 375,
      width: 400,      
      l:100,
      r:100,
      t:00,
      b:00
      

    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar",barData,barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    
    var trace1 = {
      x: sam_otu_ids,
      y: sam_sample_values,
      hovertext:(sam_otu_labels), 
      
      meta:sam_sample_values,
      mode:"markers",
      marker: {
        color: sam_sample_values.map(element=>element*1),
        colorscale: 'green',
        size: sam_sample_values.map(element=>element*1),
        // size: 9,
        // sizeref:1,
        // sizemode:"area",
        type: "scatter",      
              
       
      },
      hovermode:"closest"
      
      // name: "OTU Labels"
    }

    var data2=[trace1]
    // Deliverable 2: 2. Create the layout for the bubble chart.

    var layout = {
      title:"Bacteria Cultures Per Sample",
      // shwlegent: false,
      height: 450,
      width: 1150
    }

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.

    Plotly.newPlot("bubble", data2, layout);


    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    
    var data3 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqData,
        title: { text: "Belly Button Washing Frequency <br>Scrub per Week</br>" },       
        type: "indicator",
        mode: "gauge+number",
        // delta: { reference: 5 },
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ],
          // threshold: {
          //   line: { color: "red", width: 4 },
          //   thickness: 0.75,
          //   value: 2
          }
        }
      
    ];
    
    
  

    
    // Deliverable 3: 5. Create the layout for the gauge chart.

    var layout = {
      
     
      width: 475, height: 375, margin: { t: 100, b: 100 } };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.

    Plotly.newPlot('gauge', data3, layout);

  });
}
