import OneCountry from './OneCountry'
import Display from './Display'

const Filter = ({countries,countryName}) => {
    console.log('countryName',countryName)

    let filtered = []
    if(countryName !== null && countryName !== '') {
        filtered =  countries.filter(country => country.name.common.toLowerCase().includes(countryName.toLowerCase())) 
    }

    console.log('filtered',filtered)

    if(filtered.length > 10) {
        return (<div>
            Too many matches, specify another filter
        </div>)
    } else if(filtered.length === 1){
        return  filtered.map( country => <OneCountry key={country.name.common} country={country}></OneCountry>)
    }else {
            return filtered.map(country => <Display key={country.name.common} country={country}></Display>)
        }
    }

export default Filter;