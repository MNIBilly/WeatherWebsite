// Chiave API per WeatherAPI

const apiKey = 'ef1341cdcda24d17bc270728252406';

// Giorno della settimana
const dateObj = new Date();

const getDayName = (dayType, dateVal = dateObj) => dateVal.toLocaleDateString('en-US', { weekday: dayType });
let temperatureChartInstance = null; // Variabile globale per il grafico

// Fetch weather data dell'API */
function fetchWeatherData(loc) {
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=1&aqi=no`;

    // Controlla se l'API è raggiungibile
    fetch(apiUrl)
    .then(response => response.json())
    // Controlla se la risposta è valida
    .then(data => {
        console.log(data);

        // Aggiorna le temperature orarie
        const hours = data.forecast.forecastday[0].hour;
        const hourlyItems = document.querySelectorAll('.hourly-item');
        hourlyItems.forEach((item, idx) => {
            if (hours[idx]) {
                // Aggiorna ora
                item.querySelector('p').textContent = hours[idx].time.split(' ')[1].slice(0,5);
                // Aggiorna icona
                const iconDiv = item.querySelector('.weather-icon');
                iconDiv.className = 'weather-icon'; // classe per lo stile
                iconDiv.innerHTML = ''; // pulisci eventuali immagini
                const iconImg = document.createElement('img'); // crea un nuovo elemento immagine
                iconImg.src = hours[idx].condition.icon; // imposta l'icona
                iconImg.alt = hours[idx].condition.text; // imposta il testo alternativo
                iconImg.style.width = '32px'; // imposta la larghezza
                iconImg.style.height = '32px'; // imposta l'altezza
                iconDiv.appendChild(iconImg); // aggiungi l'immagine all'elemento icona
                // Aggiorna temperatura
                const tempP = item.querySelectorAll('p')[1]; // seleziona il secondo paragrafo
                // Controlla se esiste il paragrafo per la temperatura
                if (tempP) {
                    tempP.textContent = `${Math.round(hours[idx].temp_c)}°C`; // arrotonda la temperatura
                }
            }
        });

        // --- AGGIORNA IL GRAFICO CON I DATI ORARI ---
        const hourss = data.forecast.forecastday[0].hour;
        const tempLabels = hours.map(h => h.time.split(' ')[1].slice(0,5));
        const tempData = hours.map(h => Math.round(h.temp_c));
        updateTemperatureChart(tempLabels, tempData);

        // Imposta l'icona principale con la classe corretta
        const mainIconDiv = document.querySelector('#main-weather-info .weather-icon');
        mainIconDiv.className = 'weather-icon'; // reset class

        const isNight = data.current.is_day === 0;
        const condition = data.current.condition.text.toLowerCase();

        if (condition.includes('rain')) {
            mainIconDiv.classList.add('icon-rainy');
        } else if (isNight || condition.includes('moon') || condition.includes('night')) {
            mainIconDiv.classList.add('icon-moon');
        } else {
            mainIconDiv.classList.add('icon-sunny');
        }
        // Aggiorna i dati correnti
        document.querySelector('.current-date').textContent = `${data.current.last_updated}`;
        document.querySelector('.location').textContent = `${data.location.name}`;
        document.querySelector('.max-temperature').textContent = `${data.forecast.forecastday[0].day.maxtemp_c}°C`;
        document.querySelector('.min-temperature').textContent = `${data.forecast.forecastday[0].day.mintemp_c}°C`;
        console.log(data.forecast.forecastday[0].day.maxtemp_c);
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
        document.querySelector('.Max-Min1').textContent = `${data.forecast.forecastday[1].day.maxtemp_c}°C/${data.forecast.forecastday[1].day.mintemp_c}°C`;
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        document.querySelector('.dayF2').textContent = getDayName('long', dayAfterTomorrow);
        document.querySelector('.Max-Min2').textContent = `${data.forecast.forecastday[2].day.maxtemp_c}°C/${data.forecast.forecastday[2].day.mintemp_c}°C`;
        const twoDaysAfterTomorrow = new Date(tomorrow);
        twoDaysAfterTomorrow.setDate(twoDaysAfterTomorrow.getDate() + 2);
        document.querySelector('.dayF3').textContent = getDayName('long', twoDaysAfterTomorrow);
        document.querySelector('.Max-Min3').textContent = `${data.forecast.forecastday[3].day.maxtemp_c}°C/${data.forecast.forecastday[3].day.mintemp_c}°C`;
        /* updateForecastData(); */
        
      })
}

function updateForecastData(){
    
}
// Funzione per aggiornare il grafico della temperatura
// Utilizza Chart.js per creare o aggiornare il grafico della temperatura
function updateTemperatureChart(labels, data) {
    const ctx = document.getElementById("temperatureChart").getContext('2d'); // Ottieni il contesto del canvas
    if (temperatureChartInstance) {
        temperatureChartInstance.data.labels = labels;
        temperatureChartInstance.data.datasets[0].data = data;
        temperatureChartInstance.update();
    } else {
        temperatureChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature',
                    data: data,
                    fill: true,
                    borderColor: 'rgb(255, 217, 0)',
                    backgroundColor: 'rgba(255,217,0,0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true
            }
        });
    }
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
    console.error('Location not found:', error);
  })
