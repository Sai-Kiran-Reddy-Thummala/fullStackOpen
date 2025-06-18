import {useState, useEffect} from 'react'
import service from '../services/requests'

const CountryInfo = ({country}) => {

    const [weather,setWeather] = useState(null)

    useEffect(() => {

        if (!country?.latlng?.length) return;
        
        service
        .getCountryWeather(country.latlng[0],country.latlng[1])
        .then( countryWeather => {
            setWeather(countryWeather)
        })
        .catch(error => {
            console.log(error)
        })
    },[country])

    return ( 
        weather ? (
        <div>
            <h1>{country.name.common}</h1>
            <>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            </>
            <h1>Languages</h1>
            {
                Object.values(country.languages).map(languages => (
                    <li key={languages}>{languages}</li>
                ))
            }
            <>
            <img src={country.flags.png} 
                 alt={country.flags.alt}
                 style={{ height: '40%', width: '40%' }}
             />
            </>
             <h1>Weather in {country.name.common}</h1>
              <p>Temperature: {weather.main.temp}</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
            <p>wind: {weather.wind.speed} m/s</p>
        </div>) :
        (
        <div>
        <h1>{country.name.common}</h1>
            <>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            </>
            <h1>Languages</h1>
            {
                Object.values(country.languages).map(languages => (
                    <li key={languages}>{languages}</li>
                ))
            }
            <img src={country.flags.png} 
                 alt={country.flags.alt}
                 style={{ height: '50%', width: '50%' }}
             />

             <h1>Weather in {country.name.common}</h1>
             <p> loading weather......</p>
        </div>
        )
    )
}


export default CountryInfo