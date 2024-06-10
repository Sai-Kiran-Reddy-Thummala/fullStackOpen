import { useState } from "react"
import OneCountry from "./OneCountry"

const Display = ({country}) => {
    const [show, setShow] = useState(false)

    const handleShow = () => {
        setShow(!show)
    }
    return <div>
        {country.name.common} <button onClick={handleShow}>show</button>
        { show === true && <OneCountry key={country.name.common} country={country}></OneCountry>}
        </div>
} 

export default Display