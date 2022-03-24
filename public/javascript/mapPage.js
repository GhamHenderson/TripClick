<script src="../javascript/mapPage.js"></script>

let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
let titleHeader = "Todays Date : " + utc;
let dataCount;
let countryName;
let countriesSelected = [];
let graphdata = [];
let graphdata2 = [];
let graphdata3 = [];
let labeldata = [];
let labeldata2 = [];
let labeldata3 = [];
let namedata = [];
let namedata2 = [];
let namedata3 = [];
let chart;
let CasesTotal = 0;
let timesClicked = 0;
let buttonBool = false;
let selectedItem;
let clickcount = 0;

// Call Chart Function to build chart
chartIT();

async function chartIT() {
    const ctx = document.getElementById('chart1').getContext('2d')
    chart = new Chart(ctx, {
        options:{
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: titleHeader
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Country Name"
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                }
            }
        },
        type: 'line',
        data: {
            labels: labeldata,
            datasets: [{
                label: namedata,
                data: graphdata,
                backgroundColor: ['rgba(0,100,255,0.27)'],
                borderColor: ['rgb(0,0,0)',],
                borderWidth: 2,
                hoverOffset: 4,
            }, {
                label: namedata2,
                data: graphdata2,
                backgroundColor: ['rgba(255,0,0,0.37)'],
                borderColor: ['rgb(0,0,0)',],
                borderWidth: 2,
                hoverOffset: 4,
            }, {
                label: namedata3,
                data: graphdata3,
                backgroundColor: ['rgba(255,0,200,0.37)'],
                borderColor: ['rgb(0,0,0)',],
                borderWidth: 2,
                hoverOffset: 4,
            }
            ],
        },
    });
}

// Create an Svg variable
const svg = d3.select("svg"),
    width = +svg.attr("width")

// Map and projection
const projection = d3.geoNaturalEarth1()
    .scale(width / 1.9) // Lower the num closer the zoom
    .translate([200, 550])  // (Horizontal, Vertical)

// Load external data from geographic api and use data to project path info from map.
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        .style("stroke", "white")// Border Lines
        .attr("fill", "#348C31") // Color Of Country
        .attr("d", d3.geoPath().projection(projection))
        .on('click', function (d, i) {
            if(buttonBool === true) {
                clickHandling(i);

                if (countriesSelected.includes(i.properties.name) === true) {
                    countriesSelected.splice(countriesSelected.indexOf(i.properties.name), 1);
                    d3.select(this).style("fill", '#348C31');
                } else if (countriesSelected.includes(i.properties.name) === false) {
                    countriesSelected.push(i.properties.name);
                    d3.select(this).style("fill", '#03a5fd');
                }
            }
            else window.alert("Please Select a Data Value from the Buttons below")
        })
})

function clickHandling(i){
    countryName = i.properties.name;
    if (timesClicked < 10) {
        if(selectedItem === "covid") {
            //LOAD COVID
        }
        else if(selectedItem === "weather"){
            weatherHandler(i);
        }
        else {
            buttonClicked(countryName, selectedItem, i);
        }
        timesClicked++;
    }
    chart.update();
}


async function buttonClicked(countryName,selectedItem, i) { // Api Info -> https://world-happiness-database.herokuapp.com/
    let url = "https://world-happiness-database.herokuapp.com/api/happiness_explain/"+countryName+"";
    const response = await fetch(url);
    let apidata = await response.json();
    if(selectedItem === "gdp"){
        titleHeader = "GDP Per Capita 2022";
        graphdata.push(apidata[0].gdpPerCap);
        labeldata.push(countryName);
    }
    if(selectedItem === "happiness"){
        titleHeader = "Happiness Score in Index 2020";
        graphdata.push(apidata[0].happiness);
        labeldata.push(countryName);
    }
    if(selectedItem === "corruption"){
        titleHeader = "Country Corruption Score";
        graphdata.push(apidata[0].corruption);
        labeldata.push(countryName);
    }
    if(selectedItem === "health"){
        titleHeader = "Average Health score per country 2020";
        graphdata.push(apidata[0].health);
        labeldata.push(countryName);
    }
}

function weatherHandler(i) {
    if (clickcount === 0) {
        getCurrentWeather(i.properties.name, 1);
        clickcount++;
    } else if (clickcount === 1) {
        clickcount++;
        getCurrentWeather(i.properties.name, 2);
    } else getCurrentWeather(i.properties.name, 3);
    chart.update();
}

async function getCurrentWeather(countryName, gd) { // WeatherAPI https://www.weatherapi.com/api-explorer.aspx
    let url = "https://api.weatherapi.com/v1/forecast.json?key=687f508b47e247bdbd1113110221402&q=" + countryName + "&days=7&aqi=no&alerts=no";
    const response = await fetch(url);
    let apidata = await response.json();
    displayWeatherData(apidata, gd, countryName);
}

function displayWeatherData(apidata, gd, countryName){
    if(gd === 1){
        // Data variable will store all data received from api call
        for (let i = 0; i < apidata.forecast.forecastday.length; i++) {
            let maxtemp = apidata.forecast.forecastday[i].day.maxtemp_c;
            let day = apidata.forecast.forecastday[i].date;
            graphdata.push(maxtemp);
            labeldata.push(day);
        }
        namedata.push(countryName);
        chart.update();
    }
    else if (gd === 2) {
        for (let i = 0; i < apidata.forecast.forecastday.length; i++) {
            let maxtemp = apidata.forecast.forecastday[i].day.maxtemp_c;
            let day = apidata.forecast.forecastday[i].date;
            graphdata2.push(maxtemp);
            labeldata2.push(day);
        }
        namedata2.push(countryName);
        chart.update();
    }
    else if (gd === 3) {
        for (let i = 0; i < apidata.forecast.forecastday.length; i++) {
            let maxtemp = apidata.forecast.forecastday[i].day.maxtemp_c;
            let day = apidata.forecast.forecastday[i].date;
            graphdata3.push(maxtemp);
            labeldata3.push(day);
        }
        namedata3.push(countryName);
        chart.update();
    }
}

function destroyandRender(todo){
    if(todo === "refresh") {
        chart.destroy();
        chart.update();
    }
    else if(todo === "reset") {
        document.getElementById("infoheader").innerHTML = "Graph Data is now refreshed";
        chart.destroy();
        graphdata = [];
        labeldata = [];
        chartIT();
        chart.update;
    }
}

function selector(input){
    selectedItem = input;
    buttonBool = true;
}
