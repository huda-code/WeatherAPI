async function getWeather() {
    const apiKey = 'a18df8ada86899dd4f1563e18b324b03';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    try {
        let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        
        displayWeather(res.data);
    } catch (error) {
        console.error(error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    const detailsDiv = document.getElementById('weather-details');
    detailsDiv.innerHTML = '';  // Clear previous details

    const cityName = data.name;
    const minTemp = (data.main.temp_min - 273.15).toFixed(2);
    const maxTemp = (data.main.temp_max - 273.15).toFixed(2);
    const humidity = data.main.humidity;
    const sunrise = convertUnixTime(data.sys.sunrise);
    const sunset = convertUnixTime(data.sys.sunset);

    const weatherDetailsHTML = `
        <p><strong>City:</strong> ${cityName}</p>
        <p><strong>Min Temperature:</strong> ${minTemp}°C</p>
        <p><strong>Max Temperature:</strong> ${maxTemp}°C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Sunrise:</strong> ${sunrise}</p>
        <p><strong>Sunset:</strong> ${sunset}</p>
    `;

    detailsDiv.innerHTML = weatherDetailsHTML;
}

function convertUnixTime(unix) {
    const date = new Date(unix * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
}