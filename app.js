// OpenWeatherMap API Key
// Replace 'YOUR_API_KEY_HERE' with your actual API key from openweathermap.org
const API_KEY = "5729ce0ce677c973fabe15dd5bbff48b"; 

// DOM Elements
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusMessage = document.getElementById("statusMessage");
const weatherCard = document.getElementById("weatherCard");

const cityNameEl = document.getElementById("cityName");
const weatherDescEl = document.getElementById("weatherDescription");
const tempEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("windSpeed");

// Handle Form Submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) return;

  clearStatus();
  showStatus("Fetching weather data...", false);

  try {
    const weatherData = await fetchWeatherData(city);
    displayWeather(weatherData);
    updateTheme(weatherData.weather[0].main);
    clearStatus();
  } catch (error) {
    showStatus(error.message, true);
    weatherCard.classList.add("hidden");
  }
});

// Fetch Weather Data using async/await
async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found. Please check the spelling.");
    } else {
      throw new Error("Failed to retrieve weather data. Please try again.");
    }
  }

  return await response.json();
}

// Display Data in UI
function displayWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescEl.textContent = data.weather[0].description;
  tempEl.textContent = Math.round(data.main.temp);
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} m/s`;

  weatherCard.classList.remove("hidden");
}

// Update Theme Class on Body
function updateTheme(condition) {
  document.body.className = ""; // Reset existing classes

  switch (condition.toLowerCase()) {
    case "clear":
      document.body.classList.add("clear-sky");
      break;
    case "rain":
    case "drizzle":
    case "thunderstorm":
      document.body.classList.add("rainy");
      break;
    case "clouds":
      document.body.classList.add("cloudy");
      break;
    case "snow":
      document.body.classList.add("snowy");
      break;
    default:
      break;
  }
}

// Helper Functions
function showStatus(msg, isError = false) {
  statusMessage.textContent = msg;
  statusMessage.style.backgroundColor = isError ? "#ffe6e6" : "#e6f7ff";
  statusMessage.style.color = isError ? "#d9534f" : "#0275d8";
  statusMessage.classList.remove("hidden");
}

function clearStatus() {
  statusMessage.textContent = "";
  statusMessage.classList.add("hidden");
}