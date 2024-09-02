let weatherData;

async function getWeather() {
    const searchType = document.getElementById('search-type').value;
    const apiKey = 'a18df8ada86899dd4f1563e18b324b03';
    let weatherUrl;

    if (searchType === 'city') {
        const city = document.getElementById('city').value;

        if (!city) {
            alert('Please enter a city');
            return;
        }

        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    } else {
        const location = await getUserLocation();
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`;
    }

    try {
        const response = await fetch(weatherUrl);
        weatherData = await response.json();

        if (weatherData.cod === '404') {
            alert('City not found. Please try again.');
            return;
        }

        displayWeather(weatherData);
        document.getElementById('options').classList.remove('hidden');
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        console.error('Error:', error);
    }
}

async function getUserLocation() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=f3ae3039c16466');
        const data = await response.json();
        const loc = data.loc.split(',');
        return { latitude: loc[0], longitude: loc[1] };
    } catch (error) {
        alert('Error fetching location data. Please try again.');
        console.error('Error:', error);
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    const temperature = (data.main.temp - 273.15).toFixed(2);
    const description = data.weather[0].description;
    weatherInfo.innerHTML = `
        <p><strong>${data.name}</strong></p>
        <p>${temperature}°C, ${description}</p>
    `;
}

function showWeatherDetail(type) {
    const details = document.getElementById('details');
    details.innerHTML = '';
    switch (type) {
        case 'min':
            details.innerHTML = `<p>The Minimum Temperature in ${weatherData.name} is ${(weatherData.main.temp_min - 273.15).toFixed(2)}°C</p>`;
            break;
        case 'max':
            details.innerHTML = `<p>The Maximum Temperature in ${weatherData.name} is ${(weatherData.main.temp_max - 273.15).toFixed(2)}°C</p>`;
            break;
        case 'humidity':
            details.innerHTML = `<p>The Humidity in ${weatherData.name} is ${weatherData.main.humidity}%</p>`;
            break;
        case 'sunrise':
            const sunrise = new Date(weatherData.sys.sunrise * 1000);
            details.innerHTML = `<p>The Sunrise Time in ${weatherData.name} is ${sunrise.getHours()}:${sunrise.getMinutes()}:${sunrise.getSeconds()}</p>`;
            break;
        case 'sunset':
            const sunset = new Date(weatherData.sys.sunset * 1000);
            details.innerHTML = `<p>The Sunset Time in ${weatherData.name} is ${sunset.getHours()}:${sunset.getMinutes()}:${sunset.getSeconds()}</p>`;
            break;
    }
}

async function showForecast() {
    const apiKey = 'a18df8ada86899dd4f1563e18b324b03';
    const cityname = weatherData.name;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}`;

    try {
        const response = await fetch(forecastUrl);
        const forecastData = await response.json();

        const forecastInfo = document.getElementById('forecast-info');
        forecastInfo.innerHTML = ''; // Clear previous content

        const dailyForecasts = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toDateString();
            const hour = date.getHours();

            if (!dailyForecasts[day] || Math.abs(hour - 12) < Math.abs(dailyForecasts[day].hour - 12)) {
                dailyForecasts[day] = {
                    temp: (item.main.temp - 273.15).toFixed(2),
                    weather: item.weather[0].description,
                    hour: hour
                };
            }
        });

        for (let day in dailyForecasts) {
            forecastInfo.innerHTML += `
                <div class="forecast-item">
                    <p><strong>${day}</strong></p>
                    <p>${dailyForecasts[day].temp}°C, ${dailyForecasts[day].weather}</p>
                </div>
            `;
        }
    } catch (error) {
        alert('Error fetching forecast data. Please try again.');
        console.error('Error:', error);
    }
}
