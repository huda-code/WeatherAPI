# Weatherapi2

Weather API Application
This Weather API application allows users to retrieve real-time weather data and a 5-day forecast for any city or location. The application leverages the OpenWeather API to fetch weather data and provides an easy-to-use interface for users to interact with.

Features
Fetch current weather data by city name or based on user location (using IP).
Display details like temperature, humidity, sunrise, sunset, and more.
5-day weather forecast for a given city or location.
User-friendly interface with the ability to switch between different options.
Prerequisites
Node.js: Ensure you have Node.js installed on your system. You can download it from Node.js official website.

OpenWeather API Key: You will need an API key from OpenWeather to fetch the weather data. Sign up at OpenWeather to get your free API key.

Installation
Clone the repository:
git clone https://github.com/huda-code/Weatherapi2.git

Navigate into the project directory:
cd Weatherapi2

Install dependencies (Make sure you have the package.json file in the project folder):
npm install

Start the application:
node index.js

Using the App:
The application will ask you to either:
Enter a city name, or
Use your current location (based on IP) to fetch weather information.
You can choose options like checking the current temperature, humidity, sunrise/sunset times, or the 5-day forecast.

Accessing the Application via the Web:
You can open the index.html file in your browser using a simple HTTP server. If you have live-server or http-server installed, you can run:

live-server
or

http-server

The server will launch the application in your default browser.

Usage
Weather by City: Enter the name of a city to get its current weather details or a 5-day forecast.
Weather by Location: Select the option to fetch weather data based on your current location.

Tools and Technologies
Node.js: Backend logic and API integration.
Axios: For making HTTP requests to the OpenWeather API.
HTML/CSS/JavaScript: Front-end structure and styling.

License
This project is open-source and licensed under the MIT License.

Author
Hajira Sultana – huda-code
