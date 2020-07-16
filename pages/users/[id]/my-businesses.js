import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../app/components/Layout'
import BusinessList from '../../../app/components/BusinessList'

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
            <BusinessList businessList={myBusinesseslist} />
            <button onClick={(e) => loadMore(e)}>Más</button>
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}


export default connect((state => state), mapDispatchToProps)(MyBusinesses)
