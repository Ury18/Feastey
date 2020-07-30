import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'
import Head from 'next/head'

const MyBusinesses = (props) => {

    const { myBusinesses } = props.user

    const [myBusinesseslist, setMyBusinessesList] = useState([])

    useEffect(() => {
        if(myBusinesses) {
            getMyBusinessesBusinesses(myBusinesses)
        }
    },[])

    const getMyBusinessesBusinesses = (myBusinesses) => {
        fetch(`${process.env.FEASTEY_API_URL}/business/multiple-businesses`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(myBusinesses)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.error(res.error)
                } else {
                    setMyBusinessesList(res)
                }
            })
    }

    return (
        <Layout>
            <Head>
                <title>Mis negocios - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Mis negocios - Feastey" key="title" />
                <meta name="description" content="Pagina de visualizacion de negocios - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Mis negocios - Feastey" />
                <meta name="og:description" property="og:description" content="Pagina de visualizacion de negocios - Feastey" />
                <meta property="og:site_name" content="ury.feastey.com" />
            </Head>
            <BusinessList businessList={myBusinesseslist} />
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}


export default connect((state => state), mapDispatchToProps)(MyBusinesses)