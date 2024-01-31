// grab needed elements
var searchButton = document.querySelector('.searchBtn');
var tempEl = document.querySelector('.temp');
var windEl = document.querySelector('.wind');
var humidityEl = document.querySelector('.humidity');
var apiKey = "37ee5bb2a7e1d7f3a525ce7dbba8eee1";
var cityName = document.querySelector('.city');
var cityListEl = document.querySelector('.city-list');

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
        var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
        fetch(weatherUrl)
          .then(response => response.json())
          .then(data => {
            var temperatureKelvin = data.main.temp;
            var temperatureFahrenheit = (temperatureKelvin - 273.15) * 9/5 + 32;
            var windSpeed = data.wind.speed;
            var humidity = data.main.humidity;
  
            tempEl.textContent = `Temperature: ${temperatureFahrenheit.toFixed(2)}°F`;
            windEl.textContent = `Wind: ${windSpeed}mp/h`;
            humidityEl.textContent = `Humidity: ${humidity}%`;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    });
  }


searchButton.addEventListener('click', function() {
  var city = cityName.value.trim();
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  if (city !== '') {
    fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
        var temperatureKelvin = data.main.temp;
        var temperatureFahrenheit = (temperatureKelvin - 273.15) * 9/5 + 32;
        var windSpeed = data.wind.speed;
        var humidity = data.main.humidity;

        tempEl.textContent = `Temperature: ${temperatureFahrenheit.toFixed(2)}°F`;
        windEl.textContent = `Wind: ${windSpeed}mp/h`;
        humidityEl.textContent = `Humidity: ${humidity}%`;

        saveCity(city);
        displayCities();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
});

displayCities();