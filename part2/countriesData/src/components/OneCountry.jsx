import Weather from "./Weather"

const OneCountry = ({country}) => {
    let languages = Object.values(country.languages)
    console.log(languages)
    /*const api_key = import.meta.env.VITE_SOME_KEY
    console.log(api_key)*/
    return (
        <div>
           <h2>{country.name.common}</h2> 
           <p>capital {country.capital}</p>
           <p> area {country.area}</p>
           <strong>Languages:</strong>
           <ul>
           {languages.map(language => <li key={language} >{language}</li>)}
           </ul>
           <img src={country.flags.png} alt={country.flags.alt}></img>
            <Weather capital={country.capital}></Weather>
        </div>
    )
}

export default OneCountry