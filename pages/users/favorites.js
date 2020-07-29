import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'
import Head from 'next/head'

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
            <Head>
                <title>Mis negocios favoritos - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Mis negocios favoritos - Feastey" key="title" />
                <meta name="description" content="Pagina de visualizacion de mis negocios favoritos - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Mis negocios favoritos - Feastey" />
                <meta name="og:description" property="og:description" content="Pagina de visualizacion de mis negocios favoritos - Feastey" />
                <meta property="og:site_name" content="ury.feastey.com" />
            </Head>
            <BusinessList businessList={favoritesList} />
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}


export default connect((state => state), mapDispatchToProps)(Favorites)
