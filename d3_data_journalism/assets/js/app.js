// Most of this code came from the 12-Par_Hair_Metal_Conclusion activity | python -m SimpleHTTPServer 8000

// ----------------------------------------------
// Basic D3 Setup
// ----------------------------------------------
var svgWidth = 800;
var svgHeight = 560;

var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .classed('chart', true)
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// ----------------------------------------------
// Chart Setup
// ----------------------------------------------

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then( data =>{
	data.forEach( d => {
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(yAxis);

    // append initial circles and text
    var stateCircle = chartGroup.selectAll(".stateCircle")
        .data(data)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr('fill', '#2a3b88')
        .attr("r", 15);
    var stateText = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr('transform','translate(0,5)')
        .text(d => d.abbr);

    // Create group for 3 x-axis labels and necessary labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("aText active", true)
        .text("Living in Poverty (%)");
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("aText inactive", true)
        .text("Age (Median):");
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("aText inactive", true)
        .text("Income (Median):");
    
    // Create group for 3 y-axis labels and necessary labels
    var yLabelsGroup = chartGroup.append("g")
    var obesityLabel = yLabelsGroup.append('text')
        .attr("transform", `translate(-70,${height / 2})rotate(-90)`)
        .attr('value', 'obesity')
        .classed('aText inactive', true)
        .text('Obesity (%)');
    var smokeLabel = yLabelsGroup.append('text')
        .attr("transform", `translate(-50,${height / 2})rotate(-90)`)
        .attr('value', 'smokes')
        .classed('aText inactive', true)
        .text('Smokes (%)');
    var healthLabel = yLabelsGroup.append('text')
        .attr("transform", `translate(-30,${height / 2})rotate(-90)`)
        .attr('value', 'healthcare')
        .classed('aText active', true)
        .text('Lacks Healthcare (%)');

    // updateToolTip function above csv import
    var stateCircle = updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText);
    var stateText = updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;

                xLinearScale = xScale(data, chosenXAxis);

                // updates x axis with transition
                xAxis.transition()
                    .duration(2000)
                    .ease(d3.easeBounce)
                    .call(d3.axisBottom(xLinearScale));
                stateCircle.transition()
			        .duration(2000)
                    .ease(d3.easeBounce)
                    .on('start',function(){
			        	d3.select(this)
                            .attr("opacity", 0.75)
                            .attr('fill', '#139cd6')
			        		.attr('r', 17)})
			        .on('end',function(){
                        d3.select(this)
                            .attr('fill', '#2a3b88')
			        		.attr("opacity", 1)
			        		.attr('r',15)})
			        .attr('cx', d => xLinearScale(d[chosenXAxis]));
			    d3.selectAll('.stateText').transition()
			    	.duration(2000)
			    	.ease(d3.easeBounce)
			    	.attr('x', d => xLinearScale(d[chosenXAxis]));

                // updates circles with new values
                stateCircle = updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText);
                stateText = updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                else if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);                  
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);                    
                }
            }
        });

    // y axis labels event listener
    yLabelsGroup.selectAll('text')
    .on('click', function() {
        var value = d3.select(this).attr('value');
        if (value !== chosenYAxis) {
            chosenYAxis = value;
            yLinearScale = yScale(data, chosenYAxis);

            // updates y axis with transition
            yAxis.transition()
                .duration(2000)
                .ease(d3.easeExp)
                .call(d3.axisLeft(yLinearScale));
            stateCircle.transition()
                .duration(2000)
                .ease(d3.easeExp)
                .on('start',function(){
                    d3.select(this)
                        .attr("opacity", 0.75)
                        .attr('fill', '#6332e7')
                        .attr('r', 17)})
                .on('end',function(){
                    d3.select(this)
                        .attr('fill', '#2a3b88')
                        .attr("opacity", 1)
                        .attr('r',15)})
                .attr('cy', d => yLinearScale(d[chosenYAxis]));
            d3.selectAll('.stateText').transition()
                .duration(2000)
                .ease(d3.easeExp)
                .attr('y', d => yLinearScale(d[chosenYAxis]));

            // updates circles with new y values
            stateCircle = updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText),
            stateText = updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } 
            else if (chosenYAxis === "smokes") {
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true)
            }
            else {
                healthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true)
            }
        }
    });
});

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis])*.8, 
            d3.max(data, d => d[chosenXAxis])*1.3])
        .range([0, width]);
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis])*.8, 
            d3.max(data, d => d[chosenYAxis])*1.3])
        .range([height, 0]);
    return yLinearScale;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, chosenXAxis, stateCircle, stateText) {
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-20, 0])
        .html(d => {
            if (chosenXAxis === "poverty")
                return (`${d.state}<br>
                ${chosenYAxis}: ${d[chosenYAxis]}<br>
                ${chosenXAxis}: ${d[chosenXAxis]}`);
            else if (chosenXAxis === "income")
                return (`${d.state}<br>
                ${chosenYAxis}: ${d[chosenYAxis]}<br>
                ${chosenXAxis}: ${d[chosenXAxis]}`);
            else
                return (`${d.state}<br>
                ${chosenYAxis}: ${d[chosenYAxis]}<br>
                ${chosenXAxis}: ${d[chosenXAxis]}`);
        });

    stateCircle.call(tip);
    stateCircle
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);        
    d3.selectAll('.stateText')
        .call(tip);
    d3.selectAll('.stateText')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    return stateCircle;
}