const baseUrl = 'http://api.geonames.org/searchJSON?';
const geonamesUser = 'kkupcin'
const searchParam = 'q=';

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

export { fetchCities, postData, getData, updateUi }