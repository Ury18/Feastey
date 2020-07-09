import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'
import { useState, useEffect } from 'react'
import Router from 'next/router'


const AllBusiness = (props) => {
    const { businessList } = props

    const [page, setPage] = useState(props.queryPage)
    const [businesses, setBusinesses] = useState(businessList)
    const [location, setLocation] = useState()
    const [distance, setDistance] = useState(props.queryDistance)
    const [errors, setErrors] = useState("")

    useEffect(() => {
        getBussinessesByDistance(null, true)
    }, [])

    const loadMore = async (e) => {
        e.preventDefault()
        // let newPage = parseFloat(page) + 1
        let newPage = page + 1
        console.log(location, distance, newPage)

        let res = await fetch('http://localhost:3000/api/business/geobusiness', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ location, distance, page: newPage })
        })
        res = await res.json()
        if (res.error) {
            setErrors(res.error)
        } else {
            setErrors("")
            if (res.length > 0) {
                res.forEach(element => {
                    businesses.push(element)
                });
                setBusinesses(businesses)
                setPage(newPage)
                Router.replace(Router.pathname + `?distance=${distance}&page=${newPage}`)
            }
        }
    }

    const getBussinessesByDistance = async (e, firstLoad) => {
        if (e) e.preventDefault()

        let newPage = 1
        let count = 1

        if (firstLoad) {
            count = count * page
        }

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
                body: JSON.stringify({ location, distance, page: newPage, count })
            })

            res = await res.json()
            if (res.error) {
                setErrors(res.error)
            } else {
                setErrors("")
                setBusinesses(res)
                if (firstLoad) {
                    Router.replace(Router.pathname + `?distance=${distance}&page=${page}`)
                } else {
                    Router.replace(Router.pathname + `?distance=${distance}&page=${newPage}`)                  
                    setPage(newPage)
                }
            }
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        window.navigator.geolocation.getCurrentPosition(success, error, options)

    }
    return (
        <Layout>
            <form>
                <p>Distance</p>
                <input type="number" defaultValue={distance} onChange={(e) => setDistance(e.target.value)}></input>
                <p>km</p>
                <input type="submit" value="submit" onClick={(e) => getBussinessesByDistance(e)} />
            </form>
            <BusinessList businessList={businesses} />
            <button onClick={(e) => loadMore(e)}>Más</button>
        </Layout>
    )
}

AllBusiness.getInitialProps = async (ctx) => {
    const queryPage = parseFloat(ctx.query.page) || 1
    const queryDistance = parseFloat(ctx.query.distance) || 5
    return { queryPage, queryDistance }
}

export default AllBusiness

