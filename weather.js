const apiKey = 'ef1341cdcda24d17bc270728252406';

const dateObj = new Date();

const getDayName = (dayType, dateVal = dateObj) => dateVal.toLocaleDateString('en-US', { weekday: dayType });


/* Fetch weather data dall'API */
function fetchWeatherData(loc) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${loc}&aqi=no`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Aggiorna i dati correnti
        document.querySelector('.current-date').textContent = `${data.location.localtime}`;
        document.querySelector('.location').textContent = `${data.location.name}`;
        document.querySelector('.current-temperature').textContent = `${data.current.temp_c}°C`;
        document.querySelector('.weather-icon').src = `${data.current.condition.icon}`;
        document.querySelector('.precipitation').textContent = `${data.current.precip_mm} mm`;
        document.querySelector('.humidity').textContent = `${data.current.humidity}%`;
        document.querySelector('.uv-index').textContent = `${data.current.uv}`;
        document.querySelector('.wind-speed').textContent = `${data.current.wind_kph} km/h`;

        updateForecastData(data.forecast);
      })
}

function updateForecastData(forecastVal){

}

/* Geolocalizzazione per prendere la posizione dell'utente */
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const loc = `${lat},${lon}`;
    fetchWeatherData(loc);
  }, error => {
    console.error('Error getting location:', error);
  })