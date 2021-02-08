const baseUrl = 'http://api.geonames.org/searchJSON?';
const geonamesUser = 'kkupcin'
const searchParam = 'q=';
const errorBox = document.querySelector('.error-box');

// Get list of cities
const fetchCities = async function() {
    const userCity = document.querySelector('#location').value;
    const geonamesResponse = await fetch(baseUrl + searchParam + userCity + '&maxRows=10' + '&username=' + geonamesUser);
    const geonamesInfo = await geonamesResponse.json();
    return geonamesInfo.geonames;   
};

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
};

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
};

//Update the UI dynamically
async function updateUi(city, country, date) {
    const locationDiv = document.querySelector('.main-title');
    const dateElement = document.querySelector('.date-of-travel');
    locationDiv.innerHTML = city + ', ' + country;
    dateElement.style.display = 'block';
    dateElement.innerHTML = date;
};

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


export { fetchCities, postData, getData, updateUi, isDateValid, isResponseValid }