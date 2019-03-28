// import * as d3 from "node_modules/d3/dist/d3";

let store = {};

function loadData() {
    return d3.csv("./Data.csv").then(routes => {
        store.routes = routes;
        return store;
    });
}

let groupByAirline = function (data) {
    let count = 0;
    let result = data.reduce((result, d) => {
        let currentData = result[d.AirlineID] || {
            "AirlineID": d.AirlineID,
            "AirlineName": d.AirlineName,
            "Count": 0
        };

        currentData.Count++;
        result[d.AirlineID] = currentData;

        return result;
    }, {});
    result = Object.keys(result).map(key => result[key]).sort(d => d.Count);
    return result;
};
let visualize = function (data) {
    // container setting
    let width = 350, height = 400;
    let airLineConfig = {
        margin: {
            top: 10,
            bottom: 50,
            left: 130,
            right: 10
        },
    };
    airLineConfig.bodyHeight = height - airLineConfig.margin.top - airLineConfig.margin.bottom;
    airLineConfig.bodyWidth = width - airLineConfig.margin.left - airLineConfig.margin.right;
    console.log(airLineConfig);
    let airLines = d3.select("#AirlinesChart");
    airLines
        .attr("width", width)
        .attr("height", height);
    // scales
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, airLineConfig.bodyWidth]);
    let yScale = d3.scaleBand()
        .domain(data.map(a => a.AirlineName))
        .range([0, airLineConfig.bodyHeight])
        .padding(0.2);
    let body = airLines
        .append("g")
        .style("transform", `translate(${airLineConfig.margin.left}px,${airLineConfig.margin.top}px)`);
    body.selectAll(".bar")
        .data(data)
        .enter()
        .append('rect')
        .attr("height", yScale.bandwidth())
        .attr('y', d => yScale(d.AirlineName))
        .attr('width', d => xScale(d.Count))
        .attr('fill', '#2a5599');
    let xAx = d3.axisBottom(xScale)
        .ticks(5);
    let yAx = d3.axisLeft(yScale);
    airLines.append('g')
        .style("transform",
            `translate(${airLineConfig.margin.left}px,${airLineConfig.bodyHeight + airLineConfig.margin.top}px)`)
        .call(xAx);
    airLines.append("g")
        .style("transform", `translate(${airLineConfig.margin.left}px,${airLineConfig.margin.top}px)`)
        .call(yAx);
};

function showData() {
    let routes = store.routes;
    let airlines = groupByAirline(routes);
    console.log(airlines);
    visualize(airlines);
}

loadData().then(showData);

// let data = [{r: "abc/18"}, {r: "1/20"}, {r: "af8/29"}];
