import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../app/components/Layout'
import BusinessList from '../../../app/components/BusinessList'

const Favorites = (props) => {

    const { favorites } = props.user

    const [favoritesList, setFavoritesList] = useState([])

    useEffect(() => {
        if(favorites) {
            getFavoriteBusinesses(favorites)
        }
    },[])

    const getFavoriteBusinesses = (favorites) => {
        fetch(`${process.env.FEASTEY_API_URL}/business/multiple-businesses`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(favorites)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.error(res.error)
                } else {
                    setFavoritesList(res)
                }
            })
    }

    return (
        <Layout>
            <BusinessList businessList={favoritesList} />
            <button onClick={(e) => loadMore(e)}>Más</button>
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}


export default connect((state => state), mapDispatchToProps)(Favorites)
