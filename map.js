// Initialize the Leaflet map
const map = L.map('map').setView([22.5726, 88.3639], 13); // Default to Kolkata
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const weatherApiKey = '1442459198f6ea9b7f331f2bf1a741d0'; // Replace with your OpenWeatherMap API key
const orsApiKey = '5b3ce3597851110001cf624866eeaa8f4af948f297d37252fa435b32'; // OpenRouteService API Key

// Function to get weather information
function getWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

    return fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.weather) {
                const description = data.weather[0].description;
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                return { description, temp, humidity };
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Function to get route between from and to
function getRoute(from, to) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${from}`;

    return fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const fromCoords = [data[0].lat, data[0].lon];

                // Geocode the destination
                const geocodeUrlTo = `https://nominatim.openstreetmap.org/search?format=json&q=${to}`;
                return fetch(geocodeUrlTo)
                    .then(response => response.json())
                    .then(dataTo => {
                        if (dataTo.length > 0) {
                            const toCoords = [dataTo[0].lat, dataTo[0].lon];

                            // Fetch the route from OpenRouteService
                            const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${fromCoords[1]},${fromCoords[0]}&end=${toCoords[1]},${toCoords[0]}`;
                            return fetch(orsUrl)
                                .then(response => response.json())
                                .then(routeData => {
                                    if (routeData.features && routeData.features.length > 0) {
                                        const route = routeData.features[0].geometry.coordinates;
                                        const distance = routeData.features[0].properties.segments[0].distance; // Get distance in meters
                                        return {
                                            fromCoords,
                                            toCoords,
                                            route,
                                            distance // Include distance in the returned data
                                        };
                                    }
                                });
                        }
                    });
            }
        });
}

// Render the route on the map
function renderRoute(routeData) {
    const latLngs = routeData.route.map(coord => [coord[1], coord[0]]);
    const polyline = L.polyline(latLngs, { color: 'blue' }).addTo(map);

    // Fit the map bounds to the route
    map.fitBounds(polyline.getBounds());

    // Show the distance on the page
    document.getElementById('distanceDisplay').innerText = `Distance: ${(routeData.distance / 1000).toFixed(2)} km`; // Display distance in kilometers

    // Automatically fetch weather info and generate charts
    Promise.all([
        getWeather(routeData.fromCoords[0], routeData.fromCoords[1]),
        getWeather(routeData.toCoords[0], routeData.toCoords[1])
    ]).then(weatherDataArray => {
        const weatherStart = weatherDataArray[0];
        const weatherEnd = weatherDataArray[1];

        if (weatherStart && weatherEnd) {
            // Generate the weather chart
            generateWeatherChart(weatherStart, weatherEnd);
        }

        // Generate a simulated traffic chart
        generateTrafficChart();

        // Fetch accident data and create accident chart
        fetchAccidentData(routeData.fromCoords, routeData.toCoords)
            .then(accidentData => {
                createAccidentChart(accidentData);
            })
            .catch(err => {
                console.error('Error fetching accident data:', err);
            });
    });
}

// Generate Weather Chart using Chart.js
function generateWeatherChart(weatherStart, weatherEnd) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Start Location', 'End Location'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [weatherStart.temp, weatherEnd.temp],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }, {
                label: 'Humidity (%)',
                data: [weatherStart.humidity, weatherEnd.humidity],
                backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Generate Traffic Chart using Chart.js
function generateTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    const trafficData = [10, 15, 8, 12]; // Static example data
    const labels = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Traffic Intensity',
                data: trafficData,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fetch accident data (static data)
function fetchAccidentData(fromCoords, toCoords) {
    // Static accident data
    const staticAccidentData = {
        "Route 1": {
            "Week 1": 5,
            "Week 2": 3,
            "Week 3": 4,
            "Week 4": 2
        },
        "Route 2": {
            "Week 1": 1,
            "Week 2": 0,
            "Week 3": 2,
            "Week 4": 3
        },
        "Route 3": {
            "Week 1": 4,
            "Week 2": 5,
            "Week 3": 6,
            "Week 4": 3
        },
        "Route 4": {
            "Week 1": 2,
            "Week 2": 1,
            "Week 3": 2,
            "Week 4": 4
        },
        "Route 5": {
            "Week 1": 3,
            "Week 2": 3,
            "Week 3": 5,
            "Week 4": 2
        },
        "Route 6": {
            "Week 1": 0,
            "Week 2": 1,
            "Week 3": 1,
            "Week 4": 0
        },
        "Route 7": {
            "Week 1": 6,
            "Week 2": 5,
            "Week 3": 4,
            "Week 4": 7
        },
        "Route 8": {
            "Week 1": 2,
            "Week 2": 3,
            "Week 3": 2,
            "Week 4": 1
        },
        "Route 9": {
            "Week 1": 3,
            "Week 2": 4,
            "Week 3": 5,
            "Week 4": 3
        },
        "Route 10": {
            "Week 1": 1,
            "Week 2": 2,
            "Week 3": 0,
            "Week 4": 1
        }
    };

    // For demonstration, let's assume "from" is Route 1
    const routeKey = "Route 1"; // Change this based on the selected route
    const accidentData = staticAccidentData[routeKey];

    return new Promise((resolve) => {
        if (accidentData) {
            resolve(accidentData);
        } else {
            resolve({}); // Return an empty object if no data found
        }
    });
}

// Function to create the accident chart
function createAccidentChart(accidentData) {
    const weeks = Object.keys(accidentData);
    const accidentCounts = Object.values(accidentData);

    // Create the chart
    const accidentChartCtx = document.getElementById('accidentChart').getContext('2d');
    new Chart(accidentChartCtx, {
        type: 'bar',
        data: {
            labels: weeks,
            datasets: [{
                label: 'Number of Accidents',
                data: accidentCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Event listener for the search button
document.getElementById('searchRouteBtn').addEventListener('click', () => {
    const from = document.getElementById('fromLocation').value; // Starting location
    const to = document.getElementById('toLocation').value; // Ending location

    // Get the route
    getRoute(from, to)
        .then(routeData => {
            if (routeData) {
                renderRoute(routeData);
            }
        })
        .catch(err => {
            console.error('Error fetching route:', err);
        });
});
