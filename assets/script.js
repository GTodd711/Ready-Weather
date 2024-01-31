// Grab needed elements
var searchButton = document.querySelector('.searchBtn');
var cityName = document.querySelector('.city');
var cityListEl = document.querySelector('.city-list');
var forecastContainer = document.querySelector('.forecast-container');
var apiKey = "37ee5bb2a7e1d7f3a525ce7dbba8eee1";
var currentCity = '';

function saveCity(city) {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];

  // Check if the city already exists in the list
  var cityExists = cities.some(function(existingCity) {
    return existingCity.toLowerCase() === city.toLowerCase();
  });

  if (!cityExists) {
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
  }
}

function deleteCity(city) {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];
  var updatedCities = cities.filter(function(existingCity) {
    return existingCity.toLowerCase() !== city.toLowerCase();
  });

  localStorage.setItem('cities', JSON.stringify(updatedCities));
  displayCities();
  if (city.toLowerCase() === currentCity.toLowerCase()) {
    currentCity = ''; 
    forecastContainer.innerHTML = ''; 
  }
}

function displayCities() {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];
  cityListEl.innerHTML = '';

  cities.forEach(function(city) {
    var listItem = document.createElement('li');
    var cityNameSpan = document.createElement('span');
    var deleteButton = document.createElement('button');

    cityNameSpan.textContent = city;
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', function() {
      deleteCity(city);
    });

    listItem.appendChild(cityNameSpan);
    listItem.appendChild(deleteButton);
    cityListEl.appendChild(listItem);

    // Add click event listener to the list item
    listItem.addEventListener('click', function() {
      currentCity = city;
      updateForecast(city);
    });
  });
}

function updateForecast(city) {
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      var forecastList = data.list;
      var forecastItems = forecastList.slice(0, 4);

      forecastContainer.innerHTML = '';

      forecastItems.forEach(function(item) {
        var forecastDate = new Date(item.dt * 1000);
        var temperatureKelvin = item.main.temp;
        var temperatureFahrenheit = (temperatureKelvin - 273.15) * 9/5 + 32;
        var windSpeed = item.wind.speed;
        var humidity = item.main.humidity;

        var forecastItemEl = document.createElement('div');
        forecastItemEl.classList.add('forecast-item');
        forecastItemEl.innerHTML = `
          <p class="forecast-date">${forecastDate.toLocaleDateString()}</p>
          <p class="forecast-temp">Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
          <p class="forecast-wind">Wind: ${windSpeed}mp/h</p>
          <p class="forecast-humidity">Humidity: ${humidity}%</p>
        `;

        forecastContainer.appendChild(forecastItemEl);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

searchButton.addEventListener('click', function() {
  var city = cityName.value.trim();

  if (city !== '') {
    currentCity = city;
    saveCity(city);
    displayCities();
    updateForecast(city);
  }
});

displayCities();