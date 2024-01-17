
const APIKey = "29e7ce4405541eaa9c7ae175e326c63d";

$("#search-button").on("click", function (e) {
  e.preventDefault();
  
  // get the city the user added
  const citySearch = $("#search-input").val().trim();

  // find the info to get lat and lon
  const cityQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&units=metric&appid=${APIKey}`;

  fetch(cityQueryURL)
    .then(function (response){
      return response.json();
    })
    .then(function(data) {
      console.log(cityQueryURL);
      console.log(data);

      // extract lat and lon
      const lat = data.city.coord.lat;
      const lon = data.city.coord.lon;

      // find the url with the info to be displayed to the user
      const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

      fetch(queryURL)
        .then(function(response) {
          return response.json();
        })
        .then(function (data) {
          console.log(queryURL);
          console.log(data);
        })

        const cityName = data.city.name;
        const currentWeather = data.list[0];
        console.log(cityName);
        console.log(currentWeather);
        
      // save the city to be displayed
      saveCity(citySearch);

      displayCurrentWeather(cityName, currentWeather);
      displayForecast(data);
    })    
  });
  

  // function to display the weather for today
  function displayCurrentWeather(cityName, currentWeather) {
    const todaySection = $("#today");
    //clear the previous content
    todaySection.empty(); 
    
    // icon
    var iconCode = currentWeather["weather"][0].icon;
    console.log(iconCode);
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    // end of icon

    // create elements to the HTML to display the info
    const cityTitle = document.createElement("h2");
    cityTitle.setAttribute("class", "card");
    cityTitle.textContent = `Weather in ${cityName} today`;

    // $('.city').text(`Weather in ${cityName} today`);

    const date = $("<p>").text(`${dayjs().format("dddd, MMMM D, YYYY")}`);
    const icon = $("<img>").attr("src", iconUrl);
    const temperature = $("<p>").text(`Temperature: ${currentWeather.main.temp}ºC`);
    const humidity = $("<p>").text(`Humidity: ${currentWeather.main.humidity}%`);
    const windSpeed = $("<p>").text(`Wind Speed: ${currentWeather.wind.speed} m/s`);

    // append the elements to the today section
    todaySection.append(cityTitle, date, icon, temperature, humidity, windSpeed);
  }

  // function to display the forecast for the other days
  function displayForecast(forecastList) {
    const forecastSection = $("#forecast");
    forecastSection.empty();

    // loop pela lista de forecast
    for (let i = 0; i < 40; i += 8) {
      const forecast = forecastList["list"][i];
      console.log(forecast);

      // create elements for each day
      // const forecastDiv = document.createElement("div");
      // forecastDiv.className = "card col-md-2";

      const forecastDiv = $("<div>").addClass("card col-md-2");
      const dateForecast = $("<p>").text(`Date: ${dayjs(forecast.dt_txt).format("dddd, MMMM D, YYYY")}`);
      
      // icon
      var iconCodeForecast = forecast["weather"][0].icon;
      console.log(iconCodeForecast);
      var iconUrlForecast = "http://openweathermap.org/img/w/" + iconCodeForecast + ".png";
      const iconForecast = $("<img>").attr("src", iconUrlForecast);
      // end of icon

      const temperatureForecast = $("<p>").text(`Temperature: ${forecast.main.temp}ºC`);
      const humidityForecast = $("<p>").text(`Humidity: ${forecast.main.humidity}%`);

      forecastDiv.append(dateForecast, iconForecast, temperatureForecast, humidityForecast);
      forecastDiv.appendTo(forecastSection);
    }
  }

  // function to save the event to localStorage
  function saveCity(city) {
    const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

    savedCities.push(city);

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
};

function displaySavedCities() {
  const historyDiv = $("#history");
  historyDiv.empty();

  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

  savedCities.forEach((city) => {
    const listItemButton = $("<button>").addClass("list-group-item list-group-item-button").text(city).on("click", function() {
      $("#search-input").val(city);
      displayCurrentWeather(city);
    });
    historyDiv.append(listItemButton);
  });
}

// call the function to display the cities searched when the page loads
displaySavedCities();