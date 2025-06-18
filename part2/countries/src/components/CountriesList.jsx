
import CountryInfo from './CountryInfo'

const CountriesList = ({countries, value, handleShow}) => {

     

    if(value.trim() === ''){
        return <p>No matches, specify another</p>
    }
    
    const countriesList = countries.filter((country) => {
       return country.name.common.toLowerCase().includes(value.toLowerCase())
})
    console.log(countriesList)

     return (
        <>
            {countriesList.length > 10 && <p>Too many countries to show</p>}

            {countriesList.length === 0 && <p>No matches, specify another</p>}

            {countriesList.length > 1 && countriesList.length <= 10 && (
                <ul>
                    {countriesList.map((country) => (
                        <>
                        <li key={country.name}>{country.name.common}</li>
                        <button onClick={() => handleShow(country)}>Show</button>
                        </>
                    ))}
                </ul>
            )}

            {countriesList.length === 1 && <CountryInfo country={countriesList[0]}></CountryInfo>}
        </>
    )
}

export default CountriesList