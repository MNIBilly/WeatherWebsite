const apiKey = 'ef1341cdcda24d17bc270728252406';

const dateObj = new Date();

const getDayName = (dayType, dateVal = dateObj) => dateVal.toLocaleDateString('en-US', { weekday: dayType });


/* Fetch weather data dell'API */
function fetchWeatherData(loc) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${loc}&aqi=no`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Aggiorna i dati correnti
        document.querySelector('.current-date').textContent = `${data.current.last_updated}`;
        document.querySelector('.location').textContent = `${data.location.name}`;
        /* document.querySelector('.max-temperature').textContent = `${data.forecast.forecastday[2].maxtemp_C}°C`; */
        document.querySelector('.current-temperature').textContent = `${Math.ceil(data.current.temp_c)}°C`;
        document.querySelector('.weather-icon').src = `${data.current.isDay ? 'https://cdn.weatherapi.com/weather/64x64/day/' : 'https://cdn.weatherapi.com/weather/64x64/night/'}${data.current.condition.code}.png`;
        document.querySelector('.precipitation').textContent = `${data.current.precip_mm} mm`;
        document.querySelector('.humidity').textContent = `${data.current.humidity}%`;
        document.querySelector('.uv-index').textContent = `${data.current.uv}`;
        document.querySelector('.wind-speed').textContent = `${data.current.wind_kph} km/h`;
        
        /* updateForecastData(); */
      })
}

function updateForecastData(){
    
}

/* Event Listener per trovare le previsioni meteo in base alla posizione inserita */
document.querySelector(".location-form").addEventListener("submit", (event)=>{
  event.preventDefault();
  const searchLocation = document.getElementById("search-input").value.trim();
  if(searchLocation) {
    fetchWeatherData(searchLocation);
  }
})


/* Geolocalizzazione per prendere la posizione dell'utente */
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const loc = `${lat},${lon}`;
    fetchWeatherData(loc);
  }, error => {
    console.error('Location error:', error);
  })
