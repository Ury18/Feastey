import Layout from '../app/components/Layout'
import GoogleMap from '../app/components/GoogleMap'
import { connect } from 'react-redux'
import { useState } from 'react'



const Map = (props) => {
    const { updateUserData } = props

    const[address, setAddress] = useState("")
    const[coord,setCoords] = useState({lat:0,lng:0})

    const onSubmit = (e) => {
        e.preventDefault()

        fetch(`https://cors-anywhere.herokuapp.com/${process.env.GOOGLE_MAPS_GEOCODE_URL}address=${address}&key=${process.env.GOOGLE_MAPS_KEY}`,{
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            setCoords(response.results[0].geometry.location)
        })

    }

    return (
        <Layout>
            <form onSubmit={(e) => onSubmit(e)}>
                <input type="text" onChange={(e) => setAddress(e.target.value)}/>
                <button type="submit">Guardar</button>
            </form>
            <div className="map-container">
                <GoogleMap class="map" lat={coord.lat} lng={coord.lng} />
            </div>
        </Layout>
    )
}

Map.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Map)


