let btngdp = document.getElementById('gdpbutton');
let btncov = document.getElementById('covidbutton');
let btnwtr = document.getElementById('weatherbutton');
let btncorruption = document.getElementById('corruptionbutton');
let btnhappiness = document.getElementById('happinessbutton');
let btnhealth = document.getElementById('healthbutton');
let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
let titleHeader = "";
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
let chartType = "line";
let timesClicked = 0;
let buttonBool = false;
let selectedItem;
let clickcount = 0;
let trigger = 0;
let weatherCount = 0;
// Call Chart Function to build chart
chartIT();

async function chartIT3() {
    const ctx = document.getElementById('chart1').getContext('2d')
    chart = new Chart(ctx, {
        options:{
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Total Coronavirus Cases 21/22"
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Date"
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Total Covid Cases 21/22'
                    },
                }
            }
        },
        type: chartType,
        data: {
            labels: labeldata,
            datasets: [{
                label: namedata,
                data: graphdata,
                backgroundColor: ['rgba(0,100,255,0.27)'],
                borderColor: ['rgb(33,119,232)',],
                borderWidth: 2,
                hoverOffset: 4,
            },{
                label: namedata2,
                data: graphdata2,
                backgroundColor: ['rgba(255,0,0,0.37)'],
                borderColor: ['rgb(0,0,76)',],
                borderWidth: 2,
                hoverOffset: 4,
            },{
                label: namedata3,
                data: graphdata3,
                backgroundColor: ['rgba(255,0,200,0.37)'],
                borderColor: ['rgba(0,0,0,0.76)',],
                borderWidth: 2,
                hoverOffset: 4,
            }
            ],
        },
    });
}

async function chartIT2() {
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
                        text: "Date"
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature °C'
                    },
                }
            }
        },
        type: chartType,
        data: {
            labels: labeldata,
            datasets: [{
                label: namedata,
                data: graphdata,
                backgroundColor: ['rgba(0,56,224,0.37)','rgba(255,10,10,0.37)','rgba(208,17,255,0.37)'],
                borderColor: ['rgb(33,119,232)',],
                borderWidth: 2,
                hoverOffset: 4,
            },{
                label: namedata2,
                data: graphdata2,
                backgroundColor: ['rgba(255,0,0,0.37)','rgba(42,199,181,0.37)','rgba(63,217,91,0.37)'],
                borderColor: ['rgb(0,0,76)',],
                borderWidth: 2,
                hoverOffset: 4,
            },{
                label: namedata3,
                data: graphdata3,
                backgroundColor: ['rgba(255,0,200,0.37)'],
                borderColor: ['rgba(0,0,0,0.76)',],
                borderWidth: 2,
                hoverOffset: 4,
            }
            ],
        },
    });
}


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
        type: chartType,
        data: {
            labels: labeldata,
            datasets: [{
                label: titleHeader,
                data: graphdata,
                backgroundColor: ['rgba(0,100,255,0.27)','rgba(94,255,0,0.27)','rgb(109,234,17)','rgba(255,0,0,0.66)','rgba(0,100,255,0.27)'],
                borderColor: ['rgba(0,0,0,0.56)',],
            }],
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
            // Cant select a country until you've clicked a category
            if(buttonBool === true) {
                if (countriesSelected.includes(i.properties.name) === true) {
                    countriesSelected.splice(countriesSelected.indexOf(i.properties.name), 1);
                    d3.select(this).style("fill", '#348C31');
                } else if (countriesSelected.includes(i.properties.name) === false) {
                    //Decide What happens next
                    clickHandling(i);
                    // push selected country into the countries selected array
                    countriesSelected.push(i.properties.name);
                    d3.select(this).style("fill", '#03a5fd');
                }
            }
            else window.alert("Please Select a Data Value from the Buttons below")
        })
})
function clickHandling(i){
    countryName = i.properties.name;
    //max countries selected is ten
    if (timesClicked < 10) {
        // if statements for buttons
        if(selectedItem === "covid") {
            covHandler(i);
            chart.destroy();
            chartIT3();
            chart.update();
        }
        else if(selectedItem === "weather"){
            chart.destroy();
            chartIT2();
            weatherHandler(i);
        }
        // use a single data point api
        else {
            buttonClicked(countryName, selectedItem, i);
        }
        timesClicked++;
    }
    chart.update();
}
async function buttonClicked(countryName,selectedItem) { // Api Info -> https://world-happiness-database.herokuapp.com/
    let url = "https://world-happiness-database.herokuapp.com/api/happiness_explain/"+countryName+"";
    const response = await fetch(url);
    let apidata = await response.json();

    if(selectedItem === "gdp") {
        btngdp.style.backgroundColor = 'salmon';
        btngdp.style.color = 'white';
        titleHeader = "GDP Per Capita 2021";
        document.getElementById("dataForSelection").innerHTML = "Gross Domestic Product: % Growth Per Annum";
        graphdata.push(apidata[0].gdpPerCap);
        labeldata.push(countryName);
    }
    if(selectedItem === "happiness"){
        titleHeader = "Happiness Score in Index 2020";
        document.getElementById("dataForSelection").innerHTML = "0 = Low Score, 10 = High Score";
        graphdata.push(apidata[0].happiness);
        labeldata.push(countryName);
    }
    if(selectedItem === "corruption"){
        titleHeader = "Country Corruption Score 2019-21";
        document.getElementById("dataForSelection").innerHTML = "0 = Most Likely to experience corruption";
        graphdata.push(apidata[0].corruption);
        labeldata.push(countryName);
    }
    if(selectedItem === "health"){
        titleHeader = "Average Health score per country 2020";
        document.getElementById("dataForSelection").innerHTML = " The Health Index is a new tool to measure a broad variety of health outcomes <br> and risk factors over time, and for different geographic areas <br><br> The Higher the rating the better the healthcare system based on index";
        graphdata.push(apidata[0].health);
        labeldata.push(countryName);
    }
    destroyandRender("refresh");
    chart.update();
}
function weatherHandler(i) {
    document.getElementById("dataForSelection").innerHTML = "Temperature Displayed in Celsius";

    if (clickcount === 0) {
        getCurrentWeather(i.properties.name, 1);
        titleHeader = "Average Temp for Last 3 Days"
        clickcount++;
    } else if (clickcount === 1) {
        getCurrentWeather(i.properties.name, 2);
        clickcount++;
    } else if (clickcount === 2){
        getCurrentWeather(i.properties.name, 3);
        clickcount++;
    }
    else {
        window.alert("Max 3 Countries Clicked for this category.")
    }
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
            if(chartType === "pie" || chartType === "doughnut")
            {
                graphdata.push(maxtemp);
                labeldata.push(countryName);
                namedata.push(day);
                destroyandRender("refresh");
                return;
            }
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
            if(chartType === "pie" || chartType === "doughnut")
            {
                graphdata.push(maxtemp);
                labeldata.push(countryName);
                destroyandRender("refresh");
                return;
            }
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
            if(chartType === "pie" || chartType === "doughnut")
            {
                graphdata.push(maxtemp);
                labeldata.push(countryName);
                destroyandRender("refresh");
                return;
            }
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
        chartIT();
        chart.update();
    }
    else if(todo === "reset") {
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

function changeGraphType(input) {

    chartType = input;
    chart.destroy();
    //if covid selected build graph with 3 areas for covid data
    if (selectedItem === "covid") {
        chartIT3();
    }     //if weather selected
    else if (selectedItem === "weather") {
        chartIT2();
    }
    else {
        chartIT();
    }
    chart.update();
}


const randColor = () =>  {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

function covHandler(i) {
    document.getElementById("dataForSelection").innerHTML = "Total Covid Cases Since 1st Jan 2021";
    console.log(trigger);
    if (trigger === 0) {
        getCurrentCovid(i.properties.name,1);
        trigger++;
    } else if (trigger === 1) {
        getCurrentCovid(i.properties.name,2);
        trigger++;
    } else if (trigger === 2) {
        getCurrentCovid(i.properties.name, 3);
        trigger++;
    }
    else {
        window.alert("Max 3 Countries for this Category")

    }


}

async function getCurrentCovid(countryName, counter) {
    let countryID = isCovidDataAvailable(countryName);
    if (countryID === "error"){
        window.alert("Sorry this selection is not available");
        return;
    }
    else{
        let response;

        if(chartType === "pie" || chartType === "doughnut")
        {
            response = await fetch("https://covid19-eu-data-api-gamma.vercel.app/api/countries?alpha2=" + countryID + "&days=1");
        }
        else
            response = await fetch("https://covid19-eu-data-api-gamma.vercel.app/api/countries?alpha2=" + countryID + "&days=10");

        console.log(response);

        const data = await response.json();
        if (counter === 1) {
            let dailytotal = 0;
            for (let j = 0; j < data.length; j++) {
                for (let i = 0; i < data[j].records.length; i++) {
                    dailytotal = (data[j].records[i].cases + dailytotal);
                }
                if(chartType === "pie" || chartType === "doughnut")
                {
                    graphdata.push(dailytotal);
                    labeldata.push(countryName);
                    destroyandRender("refresh");
                    return;
                }
                graphdata.push(dailytotal);
                labeldata.push(data[j].date);
            }

            namedata.push(countryName);
            console.log(graphdata);
            console.log(labeldata);
            chart.update();
            chart.update();
        }
        else if (counter === 2) {
            for (let j = 0; j < data.length; j++) {
                let dailytotal = 0;
                for (let i = 0; i < data[j].records.length; i++) {
                    dailytotal = (data[j].records[i].cases + dailytotal);
                }
                if(chartType === "pie" || chartType === "doughnut")
                {
                    graphdata.push(dailytotal);
                    labeldata.push(countryName);
                    destroyandRender("refresh");
                    return;
                }
                graphdata2.push(dailytotal);
                labeldata2.push(data[j].date);
            }
            namedata2.push(countryName);
            console.log(graphdata2);
            console.log(labeldata2);
            chart.update();
        }
        else if (counter === 3) {
            for (let j = 0; j < data.length; j++) {
                let dailytotal = 0;
                for (let i = 0; i < data[j].records.length; i++) {
                    dailytotal = (data[j].records[i].cases + dailytotal);
                }
                if(chartType === "pie" || chartType === "doughnut")
                {
                    graphdata.push(dailytotal);
                    labeldata.push(countryName);
                    destroyandRender("refresh");
                    return;
                }
                graphdata3.push(dailytotal);
                labeldata3.push(data[j].date);
            }
            namedata3.push(countryName);
            console.log(graphdata3);
            console.log(labeldata3);
            chart.update();
        }
        else{
            window.alert("Max 3 Countries for this category");

        }
    }
}

function isCovidDataAvailable(countryName){
    let countryID;
    if(countryName === "Austria"){countryID = "at"; return countryID;}
    else if(countryName === "Belgium") {countryID = "be"; return countryID;}
    else if(countryName === "Switzerland") {countryID = "ch";return countryID;}
    else if(countryName === "Czech Republic") {countryID = "cz";return countryID;}
    else if(countryName === "Germany") {countryID = "de";return countryID;}
    else if(countryName === "England") {countryID = "england";return countryID;}
    else if(countryName === "Estonia") {countryID = "es";return countryID;}
    else if(countryName === "Finland") {countryID = "fi";return countryID;}
    else if(countryName === "France") {countryID = "fr";return countryID;}
    else if(countryName === "Greece") {countryID = "gr";return countryID;}
    else if(countryName === "Hungary") {countryID = "hu";return countryID;}
    else if(countryName === "Ireland") {countryID = "ie";return countryID;}
    else if(countryName === "Italy") {countryID = "it";return countryID;}
    else if(countryName === "Netherlands") {countryID = "nl";return countryID;}
    else if(countryName === "Norway") {countryID = "no";return countryID;}
    else if(countryName === "Poland") {countryID = "pl";return countryID;}
    else if(countryName === "Portugal") {countryID = "pt";return countryID;}
    else if(countryName === "Scotland") {countryID = "scotland";return countryID;}
    else if(countryName === "Sweden") {countryID = "se";return countryID;}
    else if(countryName === "England") {countryID = "uk";return countryID;}
    else if(countryName === "Wales") {countryID = "wales";return countryID;}
    else if(countryName === 'Spain'){countryID = "es";return countryID;}
    else {trigger--;return "error"}
}

function reloadPage()
{
    location.reload();
}

btncov.addEventListener('click', function onClick() {
    btncov.style.backgroundColor = '#0dade1';
    btnwtr.style.backgroundColor = '#007bff';
    btngdp.style.backgroundColor = '#007bff';
    btncorruption.style.backgroundColor = '#007bff';
    btnhappiness.style.backgroundColor = '#007bff';
    btnhealth.style.backgroundColor = '#007bff';
    btncov.style.color = 'white';
});

btnwtr.addEventListener('click', function onClick() {
    btnwtr.style.backgroundColor = '#0dade1';
    btncov.style.backgroundColor = '#007bff';
    btngdp.style.backgroundColor = '#007bff';
    btncorruption.style.backgroundColor = '#007bff';
    btnhappiness.style.backgroundColor = '#007bff';
    btnhealth.style.backgroundColor = '##007bff';
    btncov.style.color = 'white';
});

btngdp.addEventListener('click', function onClick() {
    btngdp.style.backgroundColor = '#0dade1';
    btncov.style.backgroundColor = '#007bff';
    btnwtr.style.backgroundColor = '#007bff';
    btncorruption.style.backgroundColor = '#007bff';
    btnhappiness.style.backgroundColor = '#007bff';
    btnhealth.style.backgroundColor = '#007bff';
    btncov.style.color = 'white';
});

btnhappiness.addEventListener('click', function onClick() {
    btnhappiness.style.backgroundColor = '#0dade1';
    btncov.style.backgroundColor = '#007bff';
    btnwtr.style.backgroundColor = '#007bff';
    btncorruption.style.backgroundColor = '#007bff';
    btngdp.style.backgroundColor = '#007bff';
    btnhealth.style.backgroundColor = '#007bff';
    btncov.style.color = 'white';
});

btncorruption.addEventListener('click', function onClick() {
    btncorruption.style.backgroundColor = '#0dade1';
    btncov.style.backgroundColor = '#007bff';
    btnwtr.style.backgroundColor = '#007bff';
    btngdp.style.backgroundColor = '#007bff';
    btnhappiness.style.backgroundColor = '#007bff';
    btnhealth.style.backgroundColor = '#007bff';
    btncov.style.color = 'white';
});

btnhealth.addEventListener('click', function onClick() {
    btnhealth.style.backgroundColor = '#0dade1';
    btncov.style.backgroundColor = '#007bff';
    btnwtr.style.backgroundColor = '#007bff';
    btncorruption.style.backgroundColor = '#007bff';
    btnhappiness.style.backgroundColor = '#007bff';
    btngdp.style.backgroundColor = '#007bff';
    btncov.style.color = 'white';
});
