import './index.scss'
import Link from 'next/link'
import SearchCard from '../SearchCard'


export default ((props) => {

    return (
        <div className="searchComponent_mainContainer">
            <div className="filter_sideBar">
                <h2 className="categories_title">Categorías</h2>
                <div>
                    <h3>Alimentación</h3>
                    <div className="category_formContainer">

                        <form className="category_form">
                            <div className="category_formDiv">
                                <input className="category_input" type="checkbox" id="carnicería" name="carnicería" value="carnicería" />
                                <label for="carnicería"> Carnicería</label><br />
                            </div>
                            <div className="category_formDiv">
                                <input className="category_input" type="checkbox" id="verdulería" name="verdulería" value="verdulería" />
                                <label for="verdulería"> Verdulería</label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <div className="searchBar_Container">
                    <div className="searchBar_Slider">
                        <h2> distance slider </h2>
                    </div>
                    <div className="nameAndAdressForm_Container">
                        <div className="nameAdressInput_Container">
                            <label for="businessName"> Business Name</label><br />
                            <input className="nameAdressInput" type="text" id="businessName" name="businessName" value="" placeholder="Nombre del negocio... (opcional)" />
                        </div>
                        <div className="nameAdressInput_Container">
                            <label for="businessAdress"> Adress</label><br />
                            <input className="nameAdressInput" type="text" id="businessAdress" name="businessAdress" value="" placeholder="Barrio, Ciudad o CP... (opcional)" />
                        </div>
                        <div className="searchButton_Container">
                            <input className="" type="submit" value="Buscar" />
                        </div>
                    </div>



                </div>
                    <SearchCard></SearchCard>
            </div>
        </div>
    )

})
