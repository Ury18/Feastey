import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import '../../stylesheets/searchForm.scss'

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
    const [nextPage, setNextpage] = useState("")
    const [showFilters, setShowFilters] = useState(false)

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
            if (res.businesses.length > 0) {
                res.businesses.forEach(element => {
                    businesses.push(element)
                });
                setBusinesses(businesses)
                setNextpage(res.nextPage)
                setPage(newPage)
                Router.replace(Router.pathname + `?distance=${distance}&page=${newPage}&category=${category}`)
            }
        }
    }

    const getBusinessesByDistance = async (e, firstLoad) => {
        if (e) e.preventDefault()

        let newPage = 1
        let count = 10

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
                setShowFilters(false)
            } else {
                setErrors("")
                setBusinesses(res.businesses)
                setNextpage(res.nextPage)
                setShowFilters(false)
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
            return <option value={item.id}>{item.name}</option>
        })
    }

    return (
        <Layout>
            <Head>
                <title>Descubre tu zona - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Descubre tu zona - Feastey" key="title" />
                <meta name="description" content="Descubre tu zona y conoce todos los negocios locales que te rodean! - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Descubre tu zona - Feastey" />
                <meta name="og:description" property="og:description" content="Descubre tu zona y conoce todos los negocios locales que te rodean! - Feastey" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <form className="searchForm">
                <div>
                    <label>Categoría</label>
                    <select name="category" defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value={""}>Todas</option>
                        {renderCategoriesOptions()}
                    </select>
                </div>
                <div>
                    <label>Nombre del negocio</label>
                    <input placeholder="Nombre del negocio" onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div>
                    <label>Dirección</label>
                    <input placeholder="Direccción, Ciudad, Codigo Postal" onChange={(e) => setTempAddress(e.target.value)}></input>
                </div>
                <div className="address">
                    <label>Distancia <span style={{ "color": "#a9a9a9" }}>(km)</span></label>
                    <div>
                        <input type="number" defaultValue={distance} onChange={(e) => setDistance(e.target.value)}></input>
                    </div>
                </div>
                <div className="button-container">
                    <input type="submit" value="Buscar" onClick={(e) => getBusinessesByDistance(e)} />
                </div>
            </form>
            <div className="openFiltersContainer" onClick={(e) => setShowFilters(true)}>
                <i className="openFilters fas fa-sliders-h" ></i>
                <span>Filtros</span>
            </div>
            <form className={`searchForm mobile ${showFilters == true ? "active" : ""}`}>
                <i className="closeFilters fas fa-times" onClick={(e) => setShowFilters(false)}></i>
                <div>
                    <label>Categoría</label>
                    <select name="category" defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value={""}>Todas</option>
                        {renderCategoriesOptions()}
                    </select>
                </div>
                <div>
                    <label>Nombre del negocio</label>
                    <input placeholder="Nombre del negocio" onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div>
                    <label>Dirección</label>
                    <input placeholder="Direccción, Ciudad, Codigo Postal" onChange={(e) => setTempAddress(e.target.value)}></input>
                </div>
                <div className="address">
                    <label>Distancia <span style={{ "color": "#a9a9a9" }}>(km)</span></label>
                    <div>
                        <input type="number" defaultValue={distance} onChange={(e) => setDistance(e.target.value)}></input>
                    </div>
                </div>
                <div className="button-container">
                    <input type="submit" value="Buscar" onClick={(e) => getBusinessesByDistance(e)} />
                </div>
            </form>

            <div className="search-businessList-container">
                <BusinessList businessList={businesses} />
            </div>
            {nextPage && <button className="more-results" onClick={(e) => loadMore(e)}>Más</button>}
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

