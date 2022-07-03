const notification = document.querySelector('.notification');
const icon = document.querySelector('.weather-icon img');
const temperatureValue = document.querySelector('.temperature-value p');
const temperatureDescription = document.querySelector('.temperature-description p');
const Location = document.querySelector('.location p');


if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = 'block';
    notification.innerHTML = "<p>Browser Doesn't Support Geolocation.</p>"
}


function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

function showError(error)  {
    notification.style.display = 'block';
    notification.innerHTML = `<p>${error.message}</p>`
}

const weather = {
    temperature: {
        unit: "celsius"
    }
};

const key = "82005d27a116c2880c8f0fcb866998a0";
const KELVIN = 273;

const celsiusToFahrenheit = temperatuer => (temperatuer * 9 / 5) + 32;

const displayWeather = () => {
    icon.src = `icons/${weather.iconId}.png`;
    temperatureValue.innerHTML = `${weather.temperature.value}&#xb0;<span>C</span>`
    temperatureDescription.innerHTML = weather.description;
    Location.innerHTML = `${weather.city}, ${weather.country}`
}


const getWeather = (latitude, longitude) => {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(res => res.json())
        .then(data => {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(() => displayWeather())
}


temperatureValue.addEventListener('click', () => {
    if(weather.temperature.value == undefined) return;
    if(weather.temperature.unit == 'celsius') {
        temperatureValue.innerHTML = `${Math.floor(celsiusToFahrenheit(weather.temperature.value))}&#xb0;<span>C</span>`
        weather.temperature.unit = 'fahrenheit';
    } else {
        temperatureValue.innerHTML = `${weather.temperature.value}&#xb0;<span>C</span>`
        weather.temperature.unit = 'celsius';
    }
})