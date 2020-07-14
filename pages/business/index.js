import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'
import { useState, useEffect } from 'react'
import Router from 'next/router'

const AllBusiness = (props) => {
    const { businessList } = props

    const [page, setPage] = useState(props.queryPage)
    const [businesses, setBusinesses] = useState(businessList)
    const [location, setLocation] = useState()
    const [category, setCategory] = useState(props.queryCategory)
    const [distance, setDistance] = useState(props.queryDistance)
    const [address, setAddress] = useState("")
    const [tempAddress, setTempAddress] = useState("")
    const [name, setName] = useState("")
    const [errors, setErrors] = useState("")

    useEffect(() => {
        getBusinessesByDistance(null, true)
    }, [])

    const loadMore = async (e) => {
        e.preventDefault()
        // let newPage = parseFloat(page) + 1
        let newPage = page + 1

        let res = await fetch(`${process.env.FEASTEY_API_URL}/business/geobusiness`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ location, distance, page: newPage, category, name })
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
                Router.replace(Router.pathname + `?distance=${distance}&page=${newPage}&category=${category}`)
            }
        }
    }

    const getBusinessesByDistance = async (e, firstLoad) => {
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
            var crd = []
            let newLocation = []

            if (pos.coords) {
                crd = pos.coords;
                newLocation.push(crd.longitude);
                newLocation.push(crd.latitude);
            } else {
                newLocation = pos
            }

            setLocation(newLocation)

            let res = await fetch(`${process.env.FEASTEY_API_URL}/business/geobusiness`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ location: newLocation, distance, page: newPage, count, category, name })
            })

            res = await res.json()
            if (res.error) {
                setErrors(res.error)
            } else {
                setErrors("")
                setBusinesses(res)
                if (firstLoad) {
                    Router.replace(Router.pathname + `?distance=${distance}&page=${page}&category=${category}`)
                } else {
                    Router.replace(Router.pathname + `?distance=${distance}&page=${newPage}&category=${category}`)
                    setPage(newPage)
                }
            }
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        if (!tempAddress) {
            window.navigator.geolocation.getCurrentPosition(success, error, options)
        } else {
            if (address !== tempAddress) {
                fetch(`https://cors-anywhere.herokuapp.com/${process.env.GOOGLE_MAPS_GEOCODE_URL}address=${tempAddress}&key=${process.env.GOOGLE_MAPS_KEY}`, {
                    headers: {
                        "content-type": "application/json"
                    }
                })
                    .then(response => response.json())
                    .then(response => {
                        let geolocation = response.results[0].geometry.location
                        geolocation = [geolocation.lng, geolocation.lat]
                        setAddress(tempAddress)
                        success(geolocation)
                    })
            } else {
                success(location)
            }
        }
    }

    const renderCategoriesOptions = () => {
        const { categories } = props

        return categories.map((item) => {
            let selected = false
            if (item.id == category) {
                selected = true
            }
            return <option selected={selected} value={item.id}>{item.name}</option>
        })
    }


    return (
        <Layout>
            <form>
                <input placeholder="Nombre del negocio" onChange={(e) => setName(e.target.value)}></input>
                <input placeholder="Direccción, Ciudad, Codigo Postal" onChange={(e) => setTempAddress(e.target.value)}></input>
                <p>Distance</p>
                <input type="number" defaultValue={distance} onChange={(e) => setDistance(e.target.value)}></input>
                <p>km</p>
                <label>Categoría</label>
                <select name="category" defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value={""}>Ninguna</option>
                    {renderCategoriesOptions()}
                </select>
                <input type="submit" value="submit" onClick={(e) => getBusinessesByDistance(e)} />
            </form>
            <BusinessList businessList={businesses} />
            <button onClick={(e) => loadMore(e)}>Más</button>
        </Layout>
    )
}

AllBusiness.getInitialProps = async (ctx) => {
    const queryPage = parseFloat(ctx.query.page) || 1
    const queryDistance = parseFloat(ctx.query.distance) || 5
    const queryCategory = ctx.query.category || ""
    let categories = await fetch(`${process.env.FEASTEY_API_URL}/categories`)
    categories = await categories.json()
    return { queryPage, queryDistance, queryCategory, categories }


}

export default AllBusiness

