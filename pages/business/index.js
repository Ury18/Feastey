import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'
import { useState } from 'react'


const AllBusiness = (props) => {
    const { businessList } = props

    const [checker, setChecker] = useState(true)
    const [businesses, setBusinesses] = useState(businessList)
    const [location, setLocation] = useState()
    const [distance, setDistance] = useState()
    const [errors, setErrors] = useState("")


    const handleCheker = () => {
        setChecker(!checker)
    }

    const getBussinessesByDistance = async (e, location, distance) => {
        e.preventDefault()

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        async function success(pos) {
            var crd = pos.coords;

            const location = []
            location.push(crd.longitude);
            location.push(crd.latitude);
            setLocation(location)

            let res = await fetch('http://localhost:3000/api/business/geobusiness', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ location, distance })
            })

            res = await res.json()
            if (res.error) {
                setErrors(res.error)
            } else {
                setErrors("")
                setBusinesses(res)
            }
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        window.navigator.geolocation.getCurrentPosition(success, error, options)

    }
    return (
        <Layout>
            <p>Show all business</p>
            <input type="checkbox" checked={checker} onClick={(e) => handleCheker()} />

            <form>
                <p>Distance</p>
                <input type="number" onChange={(e) => setDistance(e.target.value)}></input>
                <p>km</p>
                <input type="submit" value="submit" onClick={(e) => getBussinessesByDistance(e, location, distance)} />
            </form>
            {checker && < BusinessList businessList={businesses} />}
        </Layout>
    )
}

AllBusiness.getInitialProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/api/business/')
    const businessList = await res.json()
    return { businessList}
}

export default AllBusiness

