import './styles/style.scss'
import { fetchCities, getData, postData, updateLocation, updateWeather, isDateValid, updateImage, isResponseValid, fetchImage, fetchWeather, isCityValid } from './js/app.js'

const generateButton = document.querySelector('#submit-btn');

generateButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const userCity = document.querySelector('#location').value;
    const travelDate = document.querySelector('#date').value;
    const geonamesInfo = await fetchCities();
    const weatherInfo = await fetchWeather(geonamesInfo[0].lat, geonamesInfo[0].lng, travelDate);
    if (!isResponseValid(geonamesInfo.length)) { return };
    if (!isCityValid(userCity)) { return };

    //Validating user date
    if (!isDateValid(travelDate)) { return };

    //Getting image
    let imageInfo = await fetchImage(geonamesInfo[0].name);
    if (imageInfo.length === 0) {
        imageInfo = await fetchImage(geonamesInfo[0].countryName)  
    } 

    //Posting user data to the server
    await postData('http://localhost:8000/postData', {city: geonamesInfo[0].name, country: geonamesInfo[0].countryName, date: travelDate});
    const data = await getData('http://localhost:8000/getData');

    //Updating UI
    updateLocation(data.city, data.country, data.date);
    updateWeather(weatherInfo);
    updateImage(imageInfo[0].largeImageURL);
});