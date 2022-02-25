// The svg
const svg = d3.select("svg"),
    width = +svg.attr("width")

// Map and projection
const projection = d3.geoNaturalEarth1()
    .scale(width / 1.5) // Lower the num closer the zoom
    .translate([200, 700])  // (Horizontal, Vertical)

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        .attr("fill", "#348C31") // Color Of Country
        .attr("d", d3.geoPath().projection(projection))
        .on("click", (_, d) => clickHandler(d)) // Click Handling <- We Will try to Use this to display country info.
        .style("stroke", "white")// Border Lines
})

// Function to Handle Button Click
function clickHandler(d) {
    if (d.id === "IRL") {
        window.alert("You have Clicked Ireland");
    } else {
        window.alert("The Country you Clicked is " + d.id);
    }
}




