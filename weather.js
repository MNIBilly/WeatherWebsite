// Chiave API per WeatherAPI

const apiKey = 'ef1341cdcda24d17bc270728252406';

// Giorno della settimana
const dateObj = new Date();

const getDayName = (dayType, dateVal = dateObj) => dateVal.toLocaleDateString('en-US', { weekday: dayType });

// Fetch weather data dell'API */
function fetchWeatherData(loc) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${loc}&aqi=no`;

    // Controlla se l'API è raggiungibile
    fetch(apiUrl)
    .then(response => response.json())
    // Controlla se la risposta è valida
    .then(data => {
        console.log(data);
        // Aggiorna i dati correnti
        document.querySelector('.current-date').textContent = `${data.current.last_updated}`;
        document.querySelector('.location').textContent = `${data.location.name}`;
        /* document.querySelector('.max-temperature').textContent = `${data.forecast.forecastday[0].day.maxtemp_c}°C`; */
        document.querySelector('.current-temperature').textContent = `${Math.ceil(data.current.temp_c)}°C`;
        document.querySelector('.weather-icon').src = `${data.current.condition.icon}`;
        document.querySelector('.precipitation').textContent = `${data.current.precip_mm} mm`;
        document.querySelector('.humidity').textContent = `${data.current.humidity}%`;
        document.querySelector('.uv-index').textContent = `${data.current.uv}`;
        document.querySelector('.wind-speed').textContent = `${data.current.wind_kph} km/h`;
        
        // Forecast per ogni ora
        /* document.querySelector('.hour0').textContent = `${data.forecastday[0].hour[0].temp_c}°C`; */
        // Nome e temperatura massima/minima del giorno successivo
        const tomorrow = new Date(data.location.localtime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.querySelector('.dayF1').textContent = getDayName('long', tomorrow);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        document.querySelector('.dayF2').textContent = getDayName('long', dayAfterTomorrow);
        const twoDaysAfterTomorrow = new Date(tomorrow);
        twoDaysAfterTomorrow.setDate(twoDaysAfterTomorrow.getDate() + 2);
        document.querySelector('.dayF3').textContent = getDayName('long', twoDaysAfterTomorrow);
        /* updateForecastData(); */
      })
}

function updateForecastData(){
    
}

const tempValues = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

new Chart(document.getElementById("temperatureChart"), {
    type: 'line',
    data: {
        labels: tempValues,
        datasets: [{
            label: 'Temperature',
            data: [10, 10, 17, 21, 25, 27, 25, 15, 20, 25, 27, 35],
            fill: true,
            borderColor: 'rgb(255, 217, 0)',
            tension: 1
        }]
    },
    options: {
        responsive: true
    }});

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
    console.error('Location not found:', error);
  })
