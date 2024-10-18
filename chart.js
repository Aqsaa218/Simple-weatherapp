const apikey = 'e8bec2ceb484daf01e8fabb41578b90d'; 
const weatherWidget = document.getElementById('weatherWidget');
const cityNameEl = document.getElementById('cityName');
const weatherConditionEl = document.getElementById('weatherCondition');
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const weatherIconEl = document.getElementById('weatherIcon');
const windSpeedEl = document.getElementById('windSpeed');

const forecastTableBody = document.querySelector('#forecastTable tbody');

let currentPage = 1;
const entriesPerPage = 5;
let forecastData = [];
let barChartInstance = null;
let doughnutChartInstance = null;
let lineChartInstance = null;

function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apikey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`City not found: ${city}`);
            }
            return response.json();
        })
        .then(data => {
            
            if (data && data.list && data.list.length > 0) {
                const cityName = data.city.name;
                const weatherCondition = data.list[0].weather[0].main.toLowerCase();
                const temperature = data.list[0].main.temp;
                const humidity = data.list[0].main.humidity;
                const windSpeed = data.list[0].wind.speed;
                const weatherIconCode = data.list[0].weather[0].icon;

                cityNameEl.textContent = cityName;
                weatherConditionEl.textContent = weatherCondition;
                temperatureEl.textContent = `${temperature}°C`;
                humidityEl.textContent = `${humidity}%`;
                windSpeedEl.textContent = `${windSpeed} m/s`;
                weatherIconEl.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
                updateWidgetBackground(weatherCondition);

                
                forecastData = data.list.filter((entry, index) => index % 8 === 0);
                populateForecastTable();
                createCharts(forecastData);
            } else {
                showError(`No weather data available for ${city}. Please check the city name.`);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            showError(error.message); 
        });
}

// Update weather widget background according to weather condition
function updateWidgetBackground(condition) {
    weatherWidget.classList.remove('sunny', 'cloudy', 'rainy');
    if (condition.includes('clear')) {
        weatherWidget.classList.add('sunny');
    } else if (condition.includes('clouds')) {
        weatherWidget.classList.add('cloudy');
    } else if (condition.includes('rain')) {
        weatherWidget.classList.add('rainy');
    }
}

function showError(message) {
    cityNameEl.textContent = 'Error';
    weatherConditionEl.textContent = message;
    temperatureEl.textContent = '';
    humidityEl.textContent = '';
    windSpeedEl.textContent = '';
    weatherIconEl.src = '';
    forecastTableBody.innerHTML = ''; // Clear the forecast table
}

// Forecast table for the next 5 days
function populateForecastTable() {
    forecastTableBody.innerHTML = '';
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;

    const entries = forecastData.slice(start, end);
    entries.forEach(entry => {
        const row = `<tr>
                        <td>${new Date(entry.dt_txt).toLocaleDateString()}</td>
                        <td>${entry.main.temp}°C</td>
                        <td>${entry.weather[0].main}</td>
                     </tr>`;
        forecastTableBody.innerHTML += row;
    });
}

// Create or update charts using Chart.js
function createCharts(data) {
    const temperatures = data.map(entry => entry.main.temp);
    const weatherConditions = data.map(entry => entry.weather[0].main.toLowerCase());

    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    const ctxLine = document.getElementById('lineChart').getContext('2d');

    // Destroy existing charts if they exist
    if (barChartInstance) barChartInstance.destroy();
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    if (lineChartInstance) lineChartInstance.destroy();

    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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

    const sunnyCount = weatherConditions.filter(cond => cond.includes('clear')).length;
    const cloudyCount = weatherConditions.filter(cond => cond.includes('cloud')).length;
    const rainyCount = weatherConditions.filter(cond => cond.includes('rain')).length;

    doughnutChartInstance = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Sunny', 'Cloudy', 'Rainy'],
            datasets: [{
                data: [sunnyCount, cloudyCount, rainyCount],
                backgroundColor: ['#f39c12', '#95a5a6', '#3498db']
            }]
        }
    });

    lineChartInstance = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: '#3498db',
                borderWidth: 2,
                fill: false
            }]
        }
    });
}

function searchCity() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getWeatherData(city);
        const viewForecastLink = document.getElementById('viewForecastLink');
        viewForecastLink.href = `table.html?city=${encodeURIComponent(city)}`;
        viewForecastLink.style.display = 'block';
    }
}

function updateBackgroundBasedOnTime() {
    const currentHour = new Date().getHours();
    const bodyElement = document.body;

    bodyElement.classList.remove('morning', 'afternoon', 'evening', 'night');

    if (currentHour >= 6 && currentHour < 12) {
        bodyElement.classList.add('morning'); 
    } else if (currentHour >= 12 && currentHour < 18) {
        bodyElement.classList.add('afternoon'); 
    } else if (currentHour >= 18 && currentHour < 21) {
        bodyElement.classList.add('evening'); 
    } else {
        bodyElement.classList.add('night'); 
    }
}

updateBackgroundBasedOnTime();
getWeatherData('islamabad');
