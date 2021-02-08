import './styles/style.scss'
import { fetchCities, getData, postData, updateUi, isDateValid, isResponseValid } from './js/app.js'

const generateButton = document.querySelector('#submit-btn');

generateButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const geonamesInfo = await fetchCities();
    if (!isResponseValid(geonamesInfo.length)) { return };
    const travelDate = document.querySelector('#date').value;

    //Validating user date
    if (!isDateValid(travelDate)) { return };

    //Posting user data to the server
    await postData('http://localhost:8000/postData', {city: geonamesInfo[0].name, lng: geonamesInfo[0].lng, lat: geonamesInfo[0].lat, country: geonamesInfo[0].countryName, date: travelDate});
    const data = await getData('http://localhost:8000/getData');
    updateUi(data.city, data.country, data.date);
});