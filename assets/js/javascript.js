// script.js

var apiKey = '1b90fbbd758fe374aa579e5076c82ebf';
var city = '';
var cityAPIURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
var searchForm = document.getElementById('searchForm');
var cityInput = document.getElementById('cityInput');
var currentWeatherSection = document.getElementById('currentWeather');
var forecastSection = document.getElementById('forecast');
var searchHistorySection = document.getElementById('searchHistory');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();

  // Call the function to fetch weather data
  getWeatherData(city);

  // Clear the input field
  cityInput.value = '';
});

function getWeatherData(city) {
  // Update API URL with the city name
  var cityAPIURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

  // Fetch current weather data
  fetch(cityAPIURL)
    .then(response => response.json())
    .then(data => {
      // Process the data and update current weather UI
      updateCurrentWeather(data);
    })
    .catch(error => {
      console.error('Error fetching current weather data:', error);
    });

  // Fetch 5-day forecast data
  fetch(cityAPIURL)
    .then(response => response.json())
    .then(data => {
      // Process the data and update forecast UI
      updateForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });

  // Store the search history in localStorage
  updateSearchHistory(city);
}



function updateCurrentWeather(data) {
    // Extract necessary information from the data
  var cityName = data.name;
  var date = new Date(data.dt * 1000); // Convert timestamp to milliseconds
  var temperature = (data.main.temp - 273.15).toFixed(1); // kelvin to celsuis
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;
  var weatherDescription = data.weather[0].description;
  var weatherIcon = data.weather[0].icon;

  // Create HTML elements to display the current weather
  var currentWeatherHTML = `
    <h2>${cityName} - ${date.toDateString()}</h2>
    <p>Temperature: ${temperature} °C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
    <p>Condition: ${weatherDescription}</p>
    <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">`;

  // Update the current weather UI
  currentWeatherSection.innerHTML = currentWeatherHTML;
}
  
function updateForecast(data) {
    // Ensure data.list is defined
    if (data.list) {

     // Extract necessary information for the 5-day forecast
    var forecastItems = data.list.slice(0, 5); // Take the first 5 items

  // Create HTML elements for each forecast item
    var forecastHTML = forecastItems.map(item => {
    var date = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    var temperature = item.main.temp;
    var humidity = item.main.humidity;
    var windSpeed = item.wind.speed;
    var weatherDescription = item.weather[0].description;
    var weatherIcon = item.weather[0].icon;

    // Create HTML for each forecast item
    return `
      <div class="forecast-item">
        <p>Date: ${date.toDateString()}</p>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Condition: ${weatherDescription}</p>
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
      </div>`;
  }).join('');

  // Update the forecast UI
  forecastSection.innerHTML = forecastHTML;
  }
}

function containsText(element, text) {
    return element.innerText.includes(text);
}

function updateSearchHistory(city) {
    // Get existing search history from localStorage
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Add the new city to the search history
  searchHistory.push(city);

  // Limit the search history to, for example, the last 5 searches
  const limitedSearchHistory = searchHistory.slice(-5);

  // Update localStorage with the new search history
  localStorage.setItem('searchHistory', JSON.stringify(limitedSearchHistory));

  // Display the updated search history on the page
const searchHistoryHTML = limitedSearchHistory.map(city => `<p class="search-history-item">${city}</p>`).join('');
searchHistorySection.innerHTML = searchHistoryHTML;

// Add event listener to each search history item
limitedSearchHistory.forEach(historyItem => {
  const itemElements = document.querySelectorAll('.search-history-item');
  itemElements.forEach(itemElement => {
    if (containsText(itemElement, historyItem)) {
      itemElement.addEventListener('click', function () {
        // When clicked, trigger the getWeatherData function with the selected city
        getWeatherData(historyItem);
        // Display the updated search history on the page
      });
    }
  });
});
}