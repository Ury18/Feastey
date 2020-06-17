import './index.scss'
import Link from 'next/link'
import SearchCard from '../SearchCard'


export default ((props) => {

    return (
        <div className="searchComponent_mainContainer">
            <div className="filter_sideBar">
                <h2>Categorías</h2>
                <p>Category Component</p>
                <div>
                    <h3>Alimentación</h3>
                    <div className="category_formContainer">

                        <form className="category_form">
                            <input className="category_input" type="checkbox" id="carnicería" name="carnicería" value="carnicería" />
                            <label for="carnicería"> Carnicería</label><br/>
                            <input className="category_input" type="checkbox" id="verdulería" name="verdulería" value="verdulería" />
                            <label for="carnicería"> Verdulería</label>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <h1> SearchBar </h1>
                <SearchCard></SearchCard>
            </div>
        </div>
    )

})