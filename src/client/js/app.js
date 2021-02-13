const geonamesBaseUrl = 'http://api.geonames.org/searchJSON?';
const geonamesUser = 'kkupcin';
const weatherbitBaseUrlCurrent = 'http://api.weatherbit.io/v2.0/current?';
const weatherbitBaseUrlForecast = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitKey = '3159deb347dc473e837003f215251c4d';
const pixabayBaseUrl = 'https://pixabay.com/api/?key=';
const pixabayKey = '20111247-461e035714f972435ba1428ed';
const errorBox = document.querySelector('.error-box');
let valuePairs = {}

// Get list of cities
const fetchCities = async function() {
    const userCity = document.querySelector('#location').value;
    const geonamesResponse = await fetch(geonamesBaseUrl + 'q=' + userCity + '&maxRows=10' + '&username=' + geonamesUser);
    const geonamesInfo = await geonamesResponse.json();
    valuePairs = geonamesInfo.geonames;
    return geonamesInfo.geonames;   
};

// Get weather from Weatherbit API
const fetchWeather = async function(lat, lon, userDate) {
  const dateDiff = Date.parse(userDate) - Date.now();

  //Also checking if date is in the past, within a week or over 16 days away
  if (dateDiff > 1382400000) {
    displayError('Cannot fetch weather - date too far in the future');
    return false;
  } else if (dateDiff < -86400000 ) {
    displayError('Cannot fetch weather - date is in the past');
    return false;
  } else if (dateDiff < 604800000) {
    let weatherbitResponse = await fetch(weatherbitBaseUrlCurrent + 'lat=' + lat + '&lon=' + lon + '&key=' + weatherbitKey);
    let weatherbitInfo = await weatherbitResponse.json();
    convertTimezone(userDate, weatherbitInfo);
    return weatherbitInfo.data[0];
  } else {
    let weatherbitResponse = await fetch(weatherbitBaseUrlForecast + 'lat=' + lat + '&lon=' + lon + '&key=' + weatherbitKey);
    let weatherbitInfo = await weatherbitResponse.json();
    return findDateInApiResponse(userDate, weatherbitInfo.data);
  }
}

// Get image from Pixabay API
const fetchImage = async function(location) {
  const pixabayResponse = await fetch(pixabayBaseUrl + pixabayKey + '&q=' + encodeURIComponent(location) + '&image_type=photo' + '&orientation=horizontal');
  const pixabayInfo = await pixabayResponse.json();
  return pixabayInfo.hits;
}

//Post data to the server
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const resData = await response.text();
      console.log(resData);
}

//Get data from the server
async function getData(url = '') {
  const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin', 
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonData = await response.json();
    return jsonData;
}

//Update the UI dynamically
async function updateLocation(city, country, date) {
    const locationDiv = document.querySelector('.main-title');
    const dateElement = document.querySelector('.date-of-travel');
    locationDiv.innerHTML = city + ', ' + country;
    dateElement.style.display = 'block';
    dateElement.innerHTML = date;
}

async function updateWeather(weatherInfo) {
  const iconDiv = document.querySelector('.weather-logo');
  const weatherDiv = document.querySelector('.main-weather-info');
  const tempDiv = document.querySelector('.temp-div');
  const feelsDiv = document.querySelector('.feels-div');
  const sunriseDiv = document.querySelector('.sunrise-div');
  const sunsetDiv = document.querySelector('.sunset-div');
  const windDiv = document.querySelector('.wind-div');
  const humidityDiv = document.querySelector('.humidity-div');
  const mainContentDiv = document.querySelector('.location-info');

  mainContentDiv.style.display = 'flex';
  iconDiv.innerHTML = `<img src="https://www.weatherbit.io/static/img/icons/${weatherInfo.weather.icon}.png" alt="weather logo">`;
  weatherDiv.innerHTML = weatherInfo.weather.description;
  tempDiv.innerHTML = `${weatherInfo.temp}C`;
  feelsDiv.innerHTML = `${weatherInfo.app_temp ? weatherInfo.app_temp + 'C' : '-' }`;
  sunriseDiv.innerHTML = weatherInfo.sunrise ? weatherInfo.sunrise : '-';
  sunsetDiv.innerHTML = weatherInfo.sunset ? weatherInfo.sunset : '-';
  windDiv.innerHTML = `${weatherInfo.wind_spd}m/s`;
  humidityDiv.innerHTML = `${weatherInfo.rh}%`;
}

//Update UI with Image
function updateImage(imageUrl) {
  const imageDiv = document.querySelector('.background-img');
  imageDiv.style.backgroundImage = `url(${imageUrl}), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`;
}

//Validate date from user
function isDateValid(userDate) {
  if (isNaN(Date.parse(userDate)) || userDate === '') {
    displayError('Please enter a date');
    return false;
  } 
  hideError();
  return true;
}



//Validate city from user
function isCityValid(userCity) {
  if (userCity === '') {
    displayError('Please enter a city');
    return false;
  } 
  hideError();
  return true;
}

function isResponseValid(responseLength) {
  if (responseLength === 0) {
    displayError('City is invalid');
    return false;
  } 
  hideError();
  return true;
}

//Display or hide error box in the form
function displayError(message) {
  errorBox.style.display = 'block';
  errorBox.innerHTML = message;
}

function hideError() {
  errorBox.style.display = 'none';
}

// Change travel date to query against Weatherbit API
function findDateInApiResponse(travelDate, apiResponse) {
  let travelDateForAPI = travelDate.split('/')
  travelDateForAPI = [travelDateForAPI[2], travelDateForAPI[0], travelDateForAPI[1]];
  travelDateForAPI = travelDateForAPI.join('-');

  const foundDate = apiResponse.find(obj => travelDateForAPI === obj.valid_date);
  return foundDate;
}

//Convert sunrise and sunset time to destination timezone

function convertTimezone(userDate, weatherbitInfo) {
  weatherbitInfo.data[0].timezone = weatherbitInfo.data[0].timezone.replace('\\', '');
    let sunriseTime = new Date(userDate + ' ' + weatherbitInfo.data[0].sunrise);
    let sunsetTime = new Date(userDate + ' ' + weatherbitInfo.data[0].sunset);

    sunriseTime = sunriseTime.toLocaleTimeString('en-GB', {timeZone: weatherbitInfo.data[0].timezone});
    sunsetTime = sunsetTime.toLocaleTimeString('en-GB', {timeZone: weatherbitInfo.data[0].timezone});

    sunriseTime = sunriseTime.split(':');
    sunriseTime = [sunriseTime[0], sunriseTime[1]];
    sunriseTime = sunriseTime.join(':');

    sunsetTime = sunsetTime.split(':');
    sunsetTime = [sunsetTime[0], sunsetTime[1]];
    sunsetTime = sunsetTime.join(':');
    
    weatherbitInfo.data[0].sunrise = sunriseTime;
    weatherbitInfo.data[0].sunset = sunsetTime;
}


export { fetchCities, postData, getData, updateLocation, updateWeather, isDateValid, isResponseValid, updateImage, fetchImage, fetchWeather, isCityValid }