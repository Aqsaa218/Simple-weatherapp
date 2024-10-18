# Weather Forecast App

## Overview

The Weather Forecast App is a web application that provides users with current weather conditions and a 5-day weather forecast for various cities. It features a responsive design with a sidebar navigation, a search bar for city input, and an integrated chatbot for weather-related queries.

## Features

- Search for current weather and 5-day forecast by city name.
- Responsive layout for various screen sizes.
- Chatbot for interactive weather-related queries.
- Integration with OpenWeather API for weather data.
- show icon for weather
- display tables 
- have error handling 
- change  backgroung colour according to time 
- Integration with Gemini Chatbot API for additional responses.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- OpenWeather API
- Gemini Chatbot API

## Installation

To run the Weather Forecast App locally, 
go to git hub 
  

  ## filestructure
 weather-forecast-app/
|__ chart.js              # JavaScript for handling charts (to be added)
├── code.html            # Main HTML and CSS  file for the app
├── table.html            # HTML file for the weather forecast table
├── table.js              # JavaScript for fetching weather data and chatbot interactions
├── images            

## Usage
Searching Weather:
- Enter a city name in the search bar and click "Search" to fetch the weather data for that city.
- The 5-day weather forecast will be displayed in a table format below the search bar.

Chatbot Interaction:

- Use the chatbot to ask weather-related questions (e.g., "What's the weather in Paris?").
- The chatbot will respond with the relevant weather data or provide general information if the query does not specify a city.

Profile Section:
- The top-right corner displays the user's profile picture and name.

## API Information
OpenWeather API
Endpoint: https://api.openweathermap.org/data/2.5/forecast

- Parameters:
 - q: City name (e.g., London)
 - appid: Your OpenWeather API key
 - units: Unit of measurement (e.g., metric for Celsius)

Gemini Chatbot API
Endpoint: https://www.googleapis.com/customsearch/v1


- Parameters:
 - q: Query string (e.g., weather in Paris)
 - key: Your Gemini API key
 - cx: Your custom search engine ID

