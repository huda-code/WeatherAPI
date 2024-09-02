import readlineSync from "readline-sync";
import axios from "axios";

const apiKey = 'a18df8ada86899dd4f1563e18b324b03';
const axiosInstance = axios.create({
    timeout: 20000, // 20 seconds
});

// Get the user's location using an IP-based geolocation service
async function getUserLocation() {
    try {
        const response = await axios.get('https://ipinfo.io/json?token=f3ae3039c16466'); // Using your token
        const loc = response.data.loc.split(',');
        return {
            latitude: loc[0],
            longitude: loc[1],
        };
    } catch (error) {
        console.error("Error fetching location from IP:", error.message);
        throw error;
    }
}

async function getWeatherByCity(cityname) {
    try {
        let res = await axiosInstance.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`);
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error(`City '${cityname}' not found. Please enter a valid city name.`);
        } else {
            console.error("Error fetching weather data:", error.message);
        }
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        let res = await axiosInstance.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching weather data by coordinates:", error.message);
    }
}

async function getFiveDayForecast(cityname) {
    try {
        let res = await axiosInstance.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}`);
        console.log(`\n5-Day Weather Forecast for ${cityname}:`);
        console.log("----------------------------------------------------");

        // The API returns forecast data in 3-hour intervals
        const dailyForecasts = {};
        res.data.list.forEach(forecast => {
            let date = new Date(forecast.dt * 1000);
            let day = date.toDateString();
            let hour = date.getHours();

            // Capture the forecast closest to 12:00 PM for each day
            if (!dailyForecasts[day] || Math.abs(hour - 12) < Math.abs(dailyForecasts[day].hour - 12)) {
                dailyForecasts[day] = {
                    temp: (forecast.main.temp - 273.15).toFixed(2),
                    weather: forecast.weather[0].description,
                    hour: hour
                };
            }
        });

        // Display the forecast for each day
        for (let day in dailyForecasts) {
            console.log(`Date: ${day}`);
            console.log(`Temperature: ${dailyForecasts[day].temp} Centigrade`);
            console.log(`Weather: ${dailyForecasts[day].weather}`);
            console.log("----------------------------------------------------");
        }
    } catch (error) {
        console.error("Error fetching 5-day forecast data:", error.message);
    }
}

async function getWeather() {
    try {
        let choice;
        do {
            choice = readlineSync.question("Enter 'C' to search by City or 'L' for your Location: ").toUpperCase();
            if (choice !== 'C' && choice !== 'L') {
                console.log("Invalid choice. Please enter 'C' for City or 'L' for Location.");
            }
        } while (choice !== 'C' && choice !== 'L');
        
        let weatherData;
        if (choice === 'C') {
            let cityname = readlineSync.question("Enter Cityname: ");
            console.log("----------------------------------------------------");
            while (!cityname) {
                cityname = readlineSync.question("City name can't be Empty. Please re-enter the Name: ");
            }
            weatherData = await getWeatherByCity(cityname);
            if (weatherData) {
                await displayWeatherOptions(weatherData, cityname);
            }
        } else if (choice === 'L') {
            console.log("Fetching your location...");
            try {
                let { latitude, longitude } = await getUserLocation();
                console.log(`Your coordinates are: Latitude: ${latitude}, Longitude: ${longitude}`);
                weatherData = await getWeatherByCoordinates(latitude, longitude);
                if (weatherData) {
                    await displayWeatherOptions(weatherData, weatherData.name);
                }
            } catch (error) {
                console.error("Error fetching location:", error.message);
            }
        }

        repeat();

    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function displayWeatherOptions(weatherData, cityname) {
    console.log("----------------------------------------------------");
    let option = readlineSync.question("Enter an input: \n 0 to Exit \n 1 to Check MIN Temperature \n 2 to Check MAX Temperature \n 3 to Check Humidity \n 4 to Check Sunrise Time \n 5 to Check Sunset Time \n 6 to Check 5-Day Forecast\n----------------------------------------------------\nEnter Your Input: ");

    switch (option) {
        case '0':
            console.log("Thanks for using.");
            break;
        case '1':
            console.log(`The Minimum Temperature in ${weatherData.name} is ${(weatherData.main.temp_min - 273.15).toFixed(2)} Centigrade`);
            break;
        case '2':
            console.log(`The Maximum Temperature in ${weatherData.name} is ${(weatherData.main.temp_max - 273.15).toFixed(2)} Centigrade`);
            break;
        case '3':
            console.log(`The Humidity in ${weatherData.name} is ${weatherData.main.humidity}%`);
            break;
        case '4':
            displaySunrise(weatherData);
            break;
        case '5':
            displaySunset(weatherData);
            break;
        case '6':
            await getFiveDayForecast(cityname);
            break;
        default:
            console.log("Invalid option. Please try again.");
            break;
    }
}

function displaySunrise(data) {
    let unix = data.sys.sunrise;
    let date = new Date(unix * 1000);
    console.log(`The Sunrise Time in ${data.name} is ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
}

function displaySunset(data) {
    let unix = data.sys.sunset;
    let date = new Date(unix * 1000);
    console.log(`The Sunset Time in ${data.name} is ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
}

function repeat() {
    console.log("----------------------------------------------------");
    let repeatOption = readlineSync.question("Enter option \n 0 To Exit \n 1 To Continue \nEnter: ");
    if (repeatOption == 1) {
        getWeather();
    } else {
        console.log("Thanks for using");
    }
}

getWeather();
