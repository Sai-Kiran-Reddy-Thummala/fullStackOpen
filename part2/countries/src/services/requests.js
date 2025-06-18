import axios from 'axios'

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryWeatherApi = 'https://api.openweathermap.org/data/2.5/weather'

const getAll = () => {
   return axios
            .get(baseURL)
            .then(response => response.data)
}

const getCountryWeather = (latitude, longitude) => {
    console.log(import.meta.env.VITE_SOME_KEY);
    const url = `${countryWeatherApi}?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_SOME_KEY}`
    return axios
                .get(url)
                .then(response => response.data)
}

export default {getAll, getCountryWeather}