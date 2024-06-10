import axios from "axios"
import { useState,useEffect } from "react"

const Weather = ({capital}) => {
    const [weather, setWeather] = useState(null)
    console.log('capital',capital)
    let city = capital[0]
    const api_key = import.meta.env.VITE_SOME_KEY 
    console.log(api_key)
    useEffect(() => {
            axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
            .then(response => setWeather(response.data))
            .catch(error => console.log(error))
        
    },[])

    console.log('weather data',weather)

    if(weather === null) {
        return null
    }

    return (
        <div>
            <h3>Weather in {city}</h3>
            <p>{`tempeature ${(weather.main.temp - 273.5).toFixed(2)} Celcius`}</p>
            <img alt="weather icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
            <p>{`speed ${weather.wind.speed} m/s`}</p>
            
        </div>
    )
}

export default Weather